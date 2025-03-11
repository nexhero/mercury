import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
import {EventEmitter} from 'events'
class Swarm extends EventEmitter {
  constructor(storage){
    super()
    this.storage = storage
    this.swarm = null
    this.repository = ''
  }

  _encode_repository(){
    const repository = b4a.toString(this.storage.autobase.discoveryKey,'hex')
    const peer = b4a.toString(this.swarm.keyPair.publicKey,'hex')
    const key = b4a.toString(this.storage.autobase.key,'hex')
    const _decoded = repository +':'+ key +':'+ peer
    const buff = b4a.from(_decoded)
    return b4a.toString(buff,'base64')
  }
  // TODO: add try in case the repository is not encoded correctly
  _decode_repository(repository){
    const _r = b4a.from(repository,'base64')
    const decoded = b4a.toString(_r,'utf-8')
    const keys = decoded.split(':')
    return {
      topic:keys[0],
      writer:keys[1],
      peer:keys[2],
    }
  }
  async addRepository(remote_repo,name){
    return new Promise(async(resolve,reject)=>{
      try {
        const {topic,writer,peer} = this._decode_repository(remote_repo)
        const peer_name = peer.substr(0,8)
        const _name_ = name?name:peer_name
        const buff_topic = b4a.from(topic,'hex')
        const discoveryTopic = this.swarm.join(buff_topic)
        await discoveryTopic.flushed()
        console.log('** Connected to the server **')
        this.storage.appendRepository(topic,writer,peer,_name_)
            .then(()=>console.log('** Repositored has been appended to the database **'))
            .catch((err)=>reject(`Unable to append repository to the database. ${err}`))
        resolve(`You are connected to ${_name_}'s repository`)
      } catch (q) {
        reject(`Unable to connect to the server ${q}`)
      }
    })
  }
  async removeRepository(repoId){}
  async connectToAll(){

  }
  async restart(){}


  async ready(){
    const seed = await this.storage._swarmKeys()
    this.swarm = new Hyperswarm({seed:b4a.from(seed,'hex')})

    Pear.teardown(()=>this.swarm.destroy())
    console.log('** Swarm instance ready **')
    this.repository = this._encode_repository()
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
