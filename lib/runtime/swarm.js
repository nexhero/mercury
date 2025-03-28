import React, { createContext, useContext, useEffect, useRef, useState} from 'react'
import {html} from 'htm/react'
import {StorageContext} from './storage'

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
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (swarm) {
      swarm.ready()
           .then(async()=>{
             swarm.listen()
             // console.log(swarm._decode_repository('NWY4YjIzNjljMjgwZjNmYjE5ZDJlMDU4MWRjYjA0ZDg0MGM0MmI0MzM5MjM1OTc3MDNkNDZmZWJlODg1M2RmNzplYzk1YmZlNjhkMGU1MDhjOWRmYWZkYTA0NGYzZDQ4ZjdmOGVlNTY0ZGU5ZGEzNjE0MmRhMjE3OTg4MzI0MWUwOjExMDljNGQ4NjcyOTgwODJkMTU4NTI2Yjc0ZjYyNDNjMzI1YzZiNTE0MDQzNmNiYzZlOTUzNzgzY2UyMzk1MGI')) //

             // await swarm.addRepository('NWY4YjIzNjljMjgwZjNmYjE5ZDJlMDU4MWRjYjA0ZDg0MGM0MmI0MzM5MjM1OTc3MDNkNDZmZWJlODg1M2RmNzplYzk1YmZlNjhkMGU1MDhjOWRmYWZkYTA0NGYzZDQ4ZjdmOGVlNTY0ZGU5ZGEzNjE0MmRhMjE3OTg4MzI0MWUwOjExMDljNGQ4NjcyOTgwODJkMTU4NTI2Yjc0ZjYyNDNjMzI1YzZiNTE0MDQzNmNiYzZlOTUzNzgzY2UyMzk1MGI')
             //      .then(async(msg)=>{

             //      })
             // await swarm.connectToAll()
             // await swarm.removeRepository('1109c4d8')
           })
    }
  },[swarm])
    return html`
    <${SwarmContext.Provider} value=${{swarm}}>
      ${children}
    <//>
  `;
}
