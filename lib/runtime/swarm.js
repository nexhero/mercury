import React, { createContext, useContext, useEffect, useRef, useState} from 'react'
import {html} from 'htm/react'
import {StorageContext} from './storage'

import Swarm from '../swarm'

export const SwarmContext = createContext()
export const SwarmProvider = ({children})=>{
  const {storage,storageReady} = useContext(StorageContext)
  const [swarm,setSwarm] = useState(null)

  useEffect(()=>{
    if (storageReady) {
      setSwarm(new Swarm(storage))
    }
  },[storageReady])

  useEffect(()=>{
    if (swarm) {
      swarm.ready()
           .then(async()=>{
             console.log('** Network is ready **')
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
