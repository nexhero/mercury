import Hyperswarm from 'hyperswarm'
import Hyperbee from 'hyperbee'
import Corestore from 'corestore'
import RAM from 'random-access-memory'
import Hypercore from 'hypercore'
import b4a from 'b4a'
import Autobase from 'autobase'
import {EventEmitter} from 'events'
import crypto from 'hypercore-crypto'

function validatePut(prev,next){
  if (prev.value !== next.value) {
    console.log('Can be saved')
  }else{
    console.log('it wont be saved')
  }
  return prev.value !== next.value
}

const open = (store)=>{
  const core = store.get('__documents__')
  return new Hyperbee(core,{
    keyEncoding: 'utf-8',
    valueEncoding: 'json',
    extension:false
  })
}

const apply = async (batch,view,base) =>{
  const b = view.batch({update:false})
  for (const node of batch) {
    const op = node.value

    switch(op.type){
      case 'put':
        await b.put(op.key,op.value,{validatePut});
        break;
      case 'del':
        await b.del(op.key, op.opts)
        break;
      case 'addWriter':
        await base.addWriter(b4a.from(op.key,'hex'))
        break;
      case 'removeWriter':
        // avoid local writer to be removed
        try {
          if(b4a.toString(op.key,'hex') !== b4a.toString(base.key) ){
            await base.removeWriter(b4a.from(op.key,'hex'))
          }
        } catch (err) {
          // Do something
        }

        break;
      default:
        //**  */
    }
    await b.flush()
  }
}


// TODO: Add option for encrypt data, based in a password
class Database extends EventEmitter{
  constructor(store){
    super()
    this.store = store
    // Store configuration for the local instance of the app
    this.settings = new Hyperbee(
      store.get({name:'__settings__'}),
      {
        keyEncoding: 'utf-8',
        valueEncoding: 'json'
      }
    )
    this.autobase = new Autobase(store,{
      keyEncoding:'utf-8',
      valueEncoding:'json',
      open,
      apply
    })

    // Store information for the added writer, topic to join and writer keys
    this.repositories = new Hyperbee(this.store.get({name:'__channels__'}),{
      keyEncoding: 'utf-8',
      valueEncoding: 'json',
    })
    this.cores = new Map()      //Manage the list of hypercores for each repository
    this.key = ''
    this.ready = false
  }
  //////////////////////////////////////////////////////////////////////////
  // Check if there is the seed for the swarm instance, if not create one //
  // and store into the Store key _settings_                              //
  //////////////////////////////////////////////////////////////////////////
  async _swarmKeys(){
    const k = await this.settings.get('swarmKeys')
    if (k) {
      return k.value.seed
    }else{
      const buff_key = crypto.randomBytes(32)
      const key = b4a.toString(buff_key,'hex')
      await this.settings.put('swarmKeys',{seed:key})
      return key
    }
  }

  // TODO: Load the channels and autojoin to the topics
  async boot (){
    try{
      await this.autobase.ready()
      await this.settings.ready()
      await this.repositories.ready()
      const key = b4a.toString(this.autobase.key,'hex')
      this.key = key
      await this.createRepositoriesCores()
      this.autobase.on('update',()=>{
        this.emit('update')
      })
      this.ready=true
    }catch(err){
      throw err
    }
  }


  ////////////////////////////////////////
  // Basic CRUD functions for the notes //
  ////////////////////////////////////////
  saveDocument(id,data){
    return this.put(id,data)

  }
  getAllDocument(){
    return this.autobase.view.createReadStream()
  }
  removeDocument(id){
    return this.autobase.append({
      type:'del',
      key:id
    })
  }

  async put(key, value){
    try {
      const response = await this.autobase.append({
        type:'put',
        key:key,
        value,
        validatePut
      })
      this.emit('save',key)
      return response
    } catch (err) {
      throw err
    }
  }
  get(key,opts){
    return this.autobase.view.get(key,opts)
  }
  remove(key){

    return this.autobase.append({
      type:'del',
      key:key
    })
  }
  createReadStream(range,opts){
    return this.autobase.view.createReadStream(range,opts)
  }

  getAll(){
    return this.autobase.view.createReadStream()
  }
  async createRepositoriesCores(){
    try {
      for await(const repo of this.repositories.createReadStream()){
        const writer = repo.value.writer
        console.log(`Loading core for ${repo.value.name}`)
        this.cores.set(writer, new Hyperbee(this.store.get({key:writer},{
          keyEncoding: 'utf-8',
          valueEncoding: 'json',
          extension:false
        })))
        this.cores.get(writer).ready().then(async()=>{
          await this.cores.get(writer).update()
          this.cores.get(writer).core.on('append',()=>{

            this.emit('append')}
                                        )
          await this.autobase.update()
        })

      }
    } catch (err) {
      throw err
    }
  }
  async getAllRepositories(){
    try {
      const arr = []
      for await(const channel of this.repositories.createReadStream()){
        arr.push({
          id:channel.key,
          name:channel.value.name,
          topic:channel.value.topic,
          writer:channel.value.writer,
          peer:channel.value.peer,
        })
      }
      return arr
    } catch (err) {
      throw err
    }
  }

  async removeRepository(repoId) {

    try {
      const repo = await this.repositories.get(repoId);
      await this.autobase.append({
        type: 'removeWriter',
        key: this.cores.get(repo.value.writer).key
      });

      await this.repositories.del(repoId);
      this.cores.delete(repo.value.writer)
      await this.autobase.update()
      console.log(`** Repository removed ${repoId} **`)
      return repo.value;
    } catch (err) {
      throw err; // Ensures proper error propagation
    }
  }

  async appendRepository(id,topic,writer,peer,name){

    try {
      this.cores.set(writer, new Hyperbee(this.store.get({key:writer},{
        keyEncoding: 'utf8',
        valueEncoding: 'json',
        extension:false
      })))
      await this.cores.get(writer).ready()
      await this.cores.get(writer).update()
      this.cores.get(writer).on('append',()=>this.emit('append'))
      await this.autobase.append({
        type:'addWriter',
        key:this.cores.get(writer).key
      })

      await this.repositories.put(id,{
        name:name,
        topic:topic,
        writer:writer,
        peer:peer
      })
      await this.autobase.update()
      return 'Writer added'
    } catch (err) {
      throw err
    }
  }
  async getAllRepositories(){
    const arr = []
    for await(const channel of this.repositories.createReadStream()){
      arr.push({
        id:channel.key,
        name:channel.value.name,
        topic:channel.value.topic,
        writer:channel.value.writer,
        peer:channel.value.peer,

      })
    }
    return arr
  }


}
export default Database
