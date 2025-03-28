import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
import {EventEmitter} from 'events'
class Swarm extends EventEmitter {
  constructor(storage){
    super()
    this.storage = storage
    this.network = null
    this.repository = ''
  }

  _encode_repository(){
    const repository = b4a.toString(this.storage.autobase.discoveryKey,'hex')
    const peer = b4a.toString(this.network.keyPair.publicKey,'hex')
    const key = b4a.toString(this.storage.autobase.key,'hex')
    const buff = b4a.from(repository +':'+ key +':'+ peer )
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
      try {
        const _peer = this._decode_repository(remote_repo)
        console.log(_peer)
        const {topic,writer,peer} = this._decode_repository(remote_repo)
        const peer_name = peer.substr(0,8)
        const _name_ = name?name:peer_name
        const buff_topic = b4a.from(topic,'hex')
        const discoveryTopic = this.network.join(buff_topic)
        await discoveryTopic.flushed()
        // console.log(`** Connected to peer ${peer_name}**`)
        this.storage.appendRepository(peer_name,topic,writer,peer,_name_)
            .then(()=>{
              this.emit('appended',peer_name)
              console.log('** Repositored has been appended to the database **')
            })

        return `You are connected to ${_name_}'s repository`
      } catch (err) {
        throw err
      }

  }
  async removeRepository(repoId){
    try {
      const data = this.storage.removeRepository(repoId)
      this.network.leave(b4a.from(data.topic,'hex'))
    } catch (err) {
      throw err
    }
  }
  async connectToAll(){
    try {
      // const list_repo = await this.storage.getAllRepositories()
      const list_repo = []
      list_repo.forEach((r)=>{
        const discoveryRepo = this.network.join(b4a.from(r.topic,'hex'))
        discoveryRepo.flushed().then(()=>console.log(`** Connected to peer ${r.name}`))
      })
    } catch (err ) {
      throw err
    }
  }

  async allRepositories(){
    try {
      const result = this.storage.getAllRepositories()
      return result
    } catch (err) {
      throw err
    }
  }

  async ready(){
    const seed = await this.storage._swarmKeys()
    this.network = new Hyperswarm({seed:b4a.from(seed,'hex')})

    Pear.teardown(()=>this.network.destroy())
    console.log('** Swarm instance ready **')
    const discovery= this.network.join(this.storage.autobase.discoveryKey,{client:true,server:true})
    discovery.flushed().then(()=>{
      console.log('** Listen for replicators **')
      this.connectToAll()
    })
    this.repository = this._encode_repository()
    this.emit('ready')
  }

  async listen(){
    this.network.on('connection',(peer)=>{
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
    this.network.on('update',()=>{
      // TODO: create emit
    })

  }
}

export default Swarm
