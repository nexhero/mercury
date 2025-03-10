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


//////////////////////
// Defined emiters: //
//   - connection   //
//   - error        //
//   - data         //
//   - joined       //
//////////////////////
// TODO: Validate on put data; avoid to put data when has the same value
// TODO: Add emiter for all catch errors
// TODO: Add option for encrypt data, based in a password

class Notebee extends EventEmitter{
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
    this.swarm = null
    // Store information for the added writer, topic to join and writer keys
    this.channels = new Hyperbee(this.store.get({name:'__channels__'}),{
      keyEncoding: 'utf-8',
      valueEncoding: 'json',
    })
    this.cores = new Map()
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
    await this.autobase.ready()
    await this.settings.ready()
    await this.channels.ready()
    const swarmkey = await this._swarmKeys()
    this.swarm = new Hyperswarm({seed:b4a.from(swarmkey,'hex')})
    Pear.teardown(()=>this.swarm.destroy())
  }

  async listen(){
    const discovery= this.swarm.join(this.autobase.discoveryKey,{client:true,server:true})
    this.swarm.on('connection',(peer)=>{
      this.emit('connection',peer)
      this.autobase.replicate(peer)
      peer.on('data',async(data)=>{
        console.log('data from peer')
        console.log(b4a.toString(data,'utf-8'))
        this.autobase.update()
            .then(()=>console.log('added new data'))
            .catch((err)=>console.log(err))
        this.emit('sync',peer,data)
      })
      peer.on('error',(e)=>{
        console.info(`** Peer has been disconected **`)
        // this.emit('error',e)    //
      })
    })
    this.swarm.on('update',()=>{
      // TODO: create emit
    })
    discovery.flushed().then(()=>{
      console.log('** Listen for replicators **')
    })
    this.connectAllChannel()
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

  //////////////////////////////////////////////////
  // Functions for the management of repositories //
  //////////////////////////////////////////////////
  async connectAllChannel(){
    for await(const channel of this.channels.createReadStream()){
      const writer = channel.value.writer
      const discoveryKey = b4a.from(channel.value.topic ,'hex')
      const discoveryRepo = this.swarm.join(discoveryKey)
      console.log(`connecting to ${channel.value.topic}`)
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
              await this.autobase.update()
            })
            .catch((err)=>console.log('unable to update core',err))
    }
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
        status:this.swarm.peers.has(channel.value.peer)
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
      await this.swarm.leave(b4a.from(channel.value.topic,'hex'))
                .then((msg)=>console.log('removed from topic'))
                .catch((err)=>reject(err))
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
        const discoveryRepo = this.swarm.join(discoveryKey)
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

  getChannel(){
    return this._encode_channel()
  }

  getPeers(){
    return this.swarm.peers
  }

  /////////////////////////////////////////////////
  // Helper functions to encode                  //
  // all the swarm peer, autobase and topic keys //
  /////////////////////////////////////////////////
  _encode_channel(){

    const channel = b4a.toString(this.autobase.discoveryKey,'hex')
    console.log(`** Public Key ${b4a.toString(this.swarm.keyPair.publicKey,'hex')} **`)
    const peer = b4a.toString(this.swarm.keyPair.publicKey,'hex')
    const key = b4a.toString(this.autobase.key,'hex')

    const buff = b4a.from(channel +':'+ key +':'+ peer +':' )
    return b4a.toString(buff,'base64')
  }
  _decode_channe(data){
    const _r = b4a.from(data,'base64')
    const decoded = b4a.toString(_r,'utf-8')
    const keys = decoded.split(':')
    return {
      topic:keys[0],
      writer:keys[1],
      peer:keys[2],

    }
  }

}
export default Notebee
