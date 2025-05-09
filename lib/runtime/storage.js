
import React, { createContext, useEffect, useState} from 'react'
import {html} from 'htm/react'
import Corestore from 'corestore'
import RAM from 'random-access-memory'
import Database from '../database'
import { storage } from 'hypercore/lib/info'

export const StorageContext = createContext()
export const StorageProvider = ({children}) =>{
  const [store,setStore] = useState(new Corestore(Pear.config.storage))
  // const [store,setStore] = useState(new Corestore(RAM))
  const [storage,setStorage] = useState(null)
  const [storageReady,setReady] = useState()
  useEffect(()=>{
    store.ready()
         .then(()=>{
           console.log('** Store ready **')
           setStorage(new Database(store))

         })
         .catch((err)=>console.log('~~ Unable to start store ~~', err))
  },[store])
  useEffect(()=>{
    (async function(){
    if (storage) {
      await storage.boot()
      setReady(true)
      console.log('** Database ready **')
    }})()
  },[storage])
  return html`
    <${StorageContext.Provider} value=${{ store, storage, storageReady}}>
      ${children}
    <//>
  `;
}
