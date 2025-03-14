import React, { createContext, useContext, useEffect,useState} from 'react'
import {useMap} from '@mantine/hooks'
import {html} from 'htm/react'
import {StorageContext} from './storage'
export const DocumentSession = createContext()
export const DocumentSession = ({children})=>{
  const openedDocuments = useMap([])
  const {storage} = useContext(StorageContext)

  const createDocument = ()=>{}
  const openDocument = (id)=>{}
  const saveDocument = (id)=>{}
  const saveAllDocuments = ()=>{}
  const closeDocument = (id)=>{}
  const closeAllDocuments = ()=>{}

}
