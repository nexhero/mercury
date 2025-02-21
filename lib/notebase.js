import Hyperswarm from 'hyperswarm'
import Hyperbee from 'hyperbee'
import Corestore from 'corestore'
import RAM from 'random-access-memory'
import Hypercore from 'hypercore'
import b4a from 'b4a'
import Autobase from 'autobase'
import {EventEmitter} from 'events'

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
        await b.put(op.key,op.value,op.opts);
        break;
      case 'del':
        await b.del(ekey, op.opts)
        break;
      case 'addWriter':
        await base.addWriter(b4a.from(op.key,'hex'))
        break;
      default:
        //**  */
    }
    await b.flush()
  }
}
class Notebee extends EventEmitter{
  constructor(store){
    super()
    this.store = store
    this.autobase = new Autobase(store,{
      keyEncoding:'utf-8',
      valueEncoding:'json',
      open,
      apply
    })
    this.swarm = null
    this.channels = null
  }

  async boot (){
    await this.autobase.ready()
    this.swarm = new Hyperswarm()
    this.channels = new Hyperbee(this.store.get({name:'__channels__'}),{
      keyEncoding: 'utf-8',
      valueEncoding: 'json',
    })
    await this.channels.ready()
  }

  async listen(){
    const discovery= this.swarm.join(this.autobase.discoveryKey,{client:true,server:true})
    this.swarm.on('connection',(peer)=>{
      this.emit('connection',peer)
      this.autobase.replicate(peer)
      peer.on('data',async(data)=>{
        await this.autobase.update()
        this.emit('sync',peer,data)
      })
      peer.on('error',(e)=>{
        this.emit('error',e)
      })

    })

    discovery.flushed().then(()=>{
      console.log('** Listen for replicators **')
    })
  }
  getAllChannel(){
    return this.channels.createReadStream()
  }
  async addChannel(channel,name){

    return new Promise(async(resolve,reject)=>{
      try {
        const _key_ = channel.substr(0,8)
        const _name_ = name?name:_key_
        const {topic,writer} = this._decode_channe(channel)
        const discoveryKey = b4a.from(topic ,'hex')
        const discoveryRepo = this.swarm.join(discoveryKey)
        discoveryRepo.flushed().then(()=>{
          console.info('joined to repo')
        })
        await this.autobase.append({
          type:'addWriter',
          key:writer
        })

        await this.channels.put(_key_,{
          name:_name_,
          topic:topic,
          writer:writer
        })
        console.log(topic.substr(0,5))
        await this.autobase.update()
        resolve('Writer appended')
      } catch (err) {
        reject(err)
      }
    })

  }
  put(key, value, opts){
    return this.autobase.append({
      type:'put',
      key:key,
      value,
      opts
    })
  }
  get(key,opts){
    return this.autobase.view.get(key,opts)
  }
  getAll(){
    return this.autobase.view.createReadStream()
  }
  getChannel(){
    return this._encode_channel()

  }
  createReadStream(){
    return this.autobase.view.createReadStream()
  }
  _encode_channel(){
    const channel = b4a.toString(this.autobase.discoveryKey,'hex')
    console.log(b4a.toString(this.autobase.view.core.key,'hex'))
    console.log(b4a.toString(this.autobase.key,'hex'))
    const key = b4a.toString(this.autobase.key,'hex')
    const buff = b4a.from(channel +':'+ key )
    return b4a.toString(buff,'base64')
  }
  _decode_channe(data){
    const _r = b4a.from(data,'base64')
    const decoded = b4a.toString(_r,'utf-8')
    const keys = decoded.split(':')
    return {
      topic:keys[0],
      writer:keys[1]
    }
  }

}
export default Notebee
