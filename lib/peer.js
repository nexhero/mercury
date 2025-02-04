import React, { createContext, useEffect, useState} from 'react'
import {html} from 'htm/react'
import Hyperswarm from 'hyperswarm'
import Corestore from 'corestore'
import Hyperbee from 'hyperbee'
import b4a from 'b4a'
import RAM from 'random-access-memory'
// const RAM = require('random-access-memory')

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
    await core.ready().then(()=>{
      setIsReady(true)
    })
    console.info('Core ready')
    swarm.on('connection', conn => store.replicate(conn))

    console.log(core)
    const discovery = swarm.join(core.discoveryKey)
    console.info('Swarm connection ready')


    setTableNote(bee.sub('_notes'))
    console.info('subcribed to notes-sub-table')
    discovery.flushed().then(() => {
      setTopic(b4a.toString(core.key, 'hex'))
      console.info('Topic key:', b4a.toString(core.key, 'hex'))

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
