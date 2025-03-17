import React, { createContext, useContext, useEffect,useState} from 'react'
import {useMap} from '@mantine/hooks'
import {html} from 'htm/react'
import {StorageContext} from './storage'
import NoteObject from '../object/noteObject'
export const DocumentContext = createContext()
export const DocumentProvider = ({children})=>{
  const openedDocuments = useMap([])
  const {storage} = useContext(StorageContext)

  const createDocument = ()=>{
  }
  const openDocument = (id)=>{}
  const saveDocument = (id)=>{}
  const saveAllDocuments = ()=>{}
  const closeDocument = (id)=>{}
  const closeAllDocuments = ()=>{}

}
