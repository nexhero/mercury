import React, { createContext, useEffect, useState} from 'react'
import {html} from 'htm/react'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import Hyperbee from 'hyperbee'
import b4a from 'b4a'
import RAM from 'random-access-memory'

export const PeerContext = createContext()

export const PeerProvider = ({ children }) => {
  const [isReady,setIsReady] = useState(false)
  const [topic,setTopic] = useState(null)

  const [tableNote,setTableNote] = useState(null)
  const swarm = new Hyperswarm()

  // TODO: change this for release
  // const store = new Corestore(Pear.config.storage)
  // FOR DEVELOPMENT
  const store = new Corestore(RAM)
  const core = store.get({name:'demo-notes'})

  const bee = new Hyperbee(core,{
    keyEncoding:'utf-8',
    valueEncoding:'json'
  })

  const startUp = async() =>{
    core.ready().then(()=>{
      setIsReady(true)
      console.log('✅ Core ready')
    }).catch(()=>{
      console.log('❌ Core failed')
    })
    swarm.on('connection', conn => {
      console.log('⚠️ Peer connected', conn)
      store.replicate(conn)
    })

    const discovery = swarm.join(core.discoveryKey)

    setTableNote(bee.sub('_notes'))
    discovery.flushed().then(() => {
      setTopic(b4a.toString(core.key, 'hex'))
      console.info('✅ Connected to the core key: ', b4a.toString(core.key, 'hex'))
    })
  }
  useEffect(()=>{
    startUp()

  },[])
  return html`
    <${PeerContext.Provider} value=${{ topic,swarm,tableNote,isReady }}>
      ${children}
    <//>
  `;
};
