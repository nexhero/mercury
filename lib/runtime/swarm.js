import React, { createContext, useContext, useEffect, useRef, useState} from 'react'
import {html} from 'htm/react'
import {StorageContext} from './hyper'
import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
import {EventEmitter} from 'events'

class Swarm extends EventEmitter {
  constructor(storage){
    super()
    this.storage = storage
    this.swarm = null
  }
  async ready(){
    const seed = await this.storage._swarmKeys()
    console.log(`Seed: ${seed}`)
    this.swarm = new Hyperswarm({seed:b4a.from(seed,'hex')})
    Pear.teardown(()=>this.swarm.destroy())
    console.log('** swarm instance ready **')
    console.log(this.storage)
    this.emit('ready','some data')
  }
}

export const SwarmContext = createContext()
export const SwarmProvider = ({children})=>{
  const {storage} = useContext(StorageContext)
  // const swarm = useRef(new Hyperswarm({seed:b4a.from(swarmkey,'hex')}))
  const [swarm,setSwarm] = useState(null)

  const startSwarm = async()=>{
    if (swarm == null && storage) {
      storage.boot()
             .then((msg)=>setSwarm(new Swarm(storage)))
    }
  }
  useEffect(()=>{
    startSwarm()
  },[storage])
  useEffect(()=>{
    if (swarm) {
      swarm.ready()
      console.log('storage:',storage)
      // swarm.on('ready',(msg)=>console.log(`Swarm is ready ${msg}`))
    }
  },[swarm])
    return html`
    <${SwarmContext.Provider} value=${{swarm}}>
      ${children}
    <//>
  `;
}
