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
             console.log(swarm._decode_repository('NWY4YjIzNjljMjgwZjNmYjE5ZDJlMDU4MWRjYjA0ZDg0MGM0MmI0MzM5MjM1OTc3MDNkNDZmZWJlODg1M2RmNzplYzk1YmZlNjhkMGU1MDhjOWRmYWZkYTA0NGYzZDQ4ZjdmOGVlNTY0ZGU5ZGEzNjE0MmRhMjE3OTg4MzI0MWUwOjExMDljNGQ4NjcyOTgwODJkMTU4NTI2Yjc0ZjYyNDNjMzI1YzZiNTE0MDQzNmNiYzZlOTUzNzgzY2UyMzk1MGI'))

             swarm.addRepository('NWY4YjIzNjljMjgwZjNmYjE5ZDJlMDU4MWRjYjA0ZDg0MGM0MmI0MzM5MjM1OTc3MDNkNDZmZWJlODg1M2RmNzplYzk1YmZlNjhkMGU1MDhjOWRmYWZkYTA0NGYzZDQ4ZjdmOGVlNTY0ZGU5ZGEzNjE0MmRhMjE3OTg4MzI0MWUwOjExMDljNGQ4NjcyOTgwODJkMTU4NTI2Yjc0ZjYyNDNjMzI1YzZiNTE0MDQzNmNiYzZlOTUzNzgzY2UyMzk1MGI')
                  .then((msg)=>{
                    console.log('msg', msg)
                    swarm.removeRepository('1109c4d8')
                  })
           })
    }
  },[swarm])
    return html`
    <${SwarmContext.Provider} value=${{swarm}}>
      ${children}
    <//>
  `;
}
