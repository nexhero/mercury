import React, { createContext, useEffect, useState} from 'react'
import {html} from 'htm/react'
import Corestore from 'corestore'
import b4a from 'b4a'
import RAM from 'random-access-memory'
import Autopass from 'autopass'
import Notebee from './notebase'
import { atom, useAtom, useAtomValue } from 'jotai'
export const PeerContext = createContext()

export const PeerProvider = ({ children }) => {
  // const [store,setStore] = useState(new Corestore(Pear.config.storage))
  const [store,setStore] = useState(new Corestore(RAM))
  const [tableNote,setTableNote] = useState(null)
  const [isReady,setIsReady] = useState(false)
  const [publicKey,setPk] = useState('')

  useEffect(()=>{
    Pear.teardown(()=>{
      store.close()
    })

    store.ready()
         .then((msg)=>{
           setTableNote(new Notebee(store))

         })
         .catch((err)=>console.log('unable to start hypercore',err))

  },[store])

useEffect(()=>{
  (async function(){
    if (tableNote) {
      await tableNote.boot()
      const channel = tableNote.getChannel()
      console.log('Channel', channel)
      setPk(channel)
      setIsReady(true)
      tableNote.listen()
      tableNote.on('connection',(peer)=>{
        console.log('new connection',peer.publicKey)
      })
    }
  })()

},[tableNote])



return html`
    <${PeerContext.Provider} value=${{ publicKey,isReady,tableNote,setTableNote,store}}>
      ${children}
    <//>
  `;
};
