import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
import {EventEmitter} from 'events'
class Swarm extends EventEmitter {
  constructor(storage){
    super()
    this.storage = storage
    this.swarm = null
  }

  _encode_channel(){
    const channel = b4a.toString(this.storage.autobase.discoveryKey,'hex')
    const peer = b4a.toString(this.swarm.keyPair.publicKey,'hex')
    const key = b4a.toString(this.storage.autobase.key,'hex')
    const _decoded = channel +':'+ key +':'+ peer
    console.log('Decoded channel',_decoded)
    const buff = b4a.from(_decoded)
    return b4a.toString(buff,'base64')
  }
  // TODO: add try in case the channel is not encoded correctly
  _decode_channel(channel){
    const _r = b4a.from(channel,'base64')
    const decoded = b4a.toString(_r,'utf-8')
    const keys = decoded.split(':')
    return {
      topic:keys[0],
      writer:keys[1],
      peer:keys[2],
    }
  }
  async addRepository(repo){
  }
  async removeRepository(repoId){}
  async connectToAll(){

  }
  async restart(){}


  async ready(){
    const seed = await this.storage._swarmKeys()
    console.log(`Seed: ${seed}`)
    this.swarm = new Hyperswarm({seed:b4a.from(seed,'hex')})
    Pear.teardown(()=>this.swarm.destroy())
    console.log('** Swarm instance ready **')
    this.emit('ready')
  }

  async listen(){
    const discovery= this.swarm.join(this.storage.autobase.discoveryKey,{client:true,server:true})
    this.swarm.on('connection',(peer)=>{
      this.emit('connection',peer)
      this.storage.autobase.replicate(peer)
      peer.on('data',async(data)=>{
        this.storage.autobase.update()
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
  }
}

export default Swarm
