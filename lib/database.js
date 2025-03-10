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
  const core = store.get('__view__')
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
        await base.removeWriter(b4a.from(op.key,'hex'))
        break;
      default:
        //**  */
    }
    await b.flush()
  }
}

// TODO: Add emiter for all catch errors
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
    this.channels = new Hyperbee(this.store.get({name:'__channels__'}),{
      keyEncoding: 'utf-8',
      valueEncoding: 'json',
    })
    this.cores = new Map()
    this.key = ''
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
    return new Promise(async(resolve,reject)=>{
      try{
        await this.autobase.ready()
        await this.settings.ready()
        await this.channels.ready()
        const key = b4a.toString(this.autobase.key,'hex')
        this.key = key
        resolve(key)
      }catch(err){
        reject(`Unable to start database,${err}`)
      }
    })

  }


  ////////////////////////////////////////
  // Basic CRUD functions for the notes //
  ////////////////////////////////////////
  dispense(object_type){

  }

  put(key, value){
    return this.autobase.append({
      type:'put',
      key:key,
      value,
      validatePut
    })
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


  async getAllChannel(){
    const arr = []
    for await(const channel of this.channels.createReadStream()){
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

  async removeChannel(id){
    return new Promise(async(resolve,reject)=>{
      const channel = await this.channels.get(id)
      if (!channel) {
        console.error(`Unable to find channel to id: ${id}`)
        reject('channel not found')
      }
      this.autobase.append({
        type:'removeWriter',
        key:channel.value.writer
      }).catch((err)=>reject(err))

      await this.channels.del(id)
      resolve('Channel has been removed')
    })
  }

  async addChannel(channel,name){
    return new Promise(async(resolve,reject)=>{
      try {
        const {topic,writer,peer} = this._decode_channe(channel)
        const _key_ = peer.substr(0,8)
        const _name_ = name?name:_key_
        const discoveryKey = b4a.from(topic ,'hex')
        this.cores.set(writer, new Hyperbee(this.store.get({key:writer},{
          keyEncoding: 'utf-8',
          valueEncoding: 'json',
          extension:false
        })))


        this.cores.get(writer).ready()
            .then(()=>console.log('core ready'))
            .catch((err)=>console.log(err))
        discoveryRepo.flushed().then(()=>{
          console.info('joined to repo')
        })
        this.cores.get(writer).update()
            .then(async()=>{
              this.autobase.append({
                type:'addWriter',
                key:this.cores.get(writer).key
              }).catch((err)=>console.log('errror adding writer',err))
              // Save channel information into the local storage
              await this.channels.put(_key_,{
                name:_name_,
                topic:topic,
                writer:writer,
                peer:peer
              })
              await this.autobase.update()
            })
            .catch((err)=>console.log('unable to update core',err))


        resolve('Writer appended')
      } catch (err) {
        reject(err)
      }
    })

  }

}
export default Database
