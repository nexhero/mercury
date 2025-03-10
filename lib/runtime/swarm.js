import React, { createContext, useContext, useEffect, useRef, useState} from 'react'
import {html} from 'htm/react'
import {StorageContext} from './hyper'

import Swarm from '../swarm'

export const SwarmContext = createContext()
export const SwarmProvider = ({children})=>{
  const {storage} = useContext(StorageContext)
  const [swarm,setSwarm] = useState(null)

  const startSwarm = async()=>{
    if (swarm == null && storage) {
      storage.boot()
             .then((msg)=>{
               setSwarm(new Swarm(storage))
             })
    }
  }

  useEffect(()=>{
    startSwarm()
  },[storage])

  useEffect(()=>{
    if (swarm) {
      swarm.ready()
           .then(()=>{
             swarm.listen()
           })
    }
  },[swarm])
    return html`
    <${SwarmContext.Provider} value=${{swarm}}>
      ${children}
    <//>
  `;
}
