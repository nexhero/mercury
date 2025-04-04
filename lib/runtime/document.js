///////////////////////////////
// Manage the opened objects //
///////////////////////////////

//FIXME: When open or creating new document set the tab focus to the new note
import React, { createContext, useContext, useEffect,useState} from 'react'
import {useMap} from '@mantine/hooks'
import {html} from 'htm/react'

import {StorageContext} from './storage'
import NoteObject from '../object/noteObject'
import { SwarmContext } from './swarm'

export const DocumentContext = createContext()
export const DocumentProvider = ({children})=>{
  const openedDocuments = useMap([])

  const [tagList,setTagList] = useState([])
  const [documentList,setDocumentList] = useState([])
  const {storage, storageReady} = useContext(StorageContext)
  const {swarm} = useContext(SwarmContext)
  const listAllDocuments = async()=>{
    const arr = []
    const tagBatch = []
    for await(const doc of storage.getAllDocument()){
      const document = doc.value
      const indexTag = arr.findIndex((t)=>t.value === document.tag)
      if (document.tag) {
        if (indexTag>=0) {
          arr[indexTag].children.push({
            label:document.label,
            value:document.id,
            type:'note',
            children:[]
          })
        }else{
          arr.push({
            label: document.tag,
            value: document.tag,
            children: [],
            type:'tag'
          })
          tagBatch.push(document.tag)
          arr[arr.length-1].children.push({
            label:document.label,
            value:document.id,
            type:'note',
            children:[]
          })
        }
        // document has no tag, and is added to the root
      }else{
        arr.push({
          label: document.label,
          value: document.id,
          children: [],
          type:document.type
        })
      }
    }
    setDocumentList(arr)
    setTagList(tagBatch)
  }

  const newDocument = (id)=>{
    const _new = new NoteObject(storage)
    openedDocuments.set(_new.id,_new)
  }

  const openDocument = async(id)=>{
    const entry = await storage.get(id)
    if (entry) {
      // const _record = new NoteClass(entry.value)
      const _record = new NoteObject(storage)
      _record.fromJson(entry.value)
      openedDocuments.set(_record.id,_record)
    }
  }
  const save = (map_key)=>{
    return new Promise(async(resolve,reject)=>{
      console.log('saving....',data)
      try {
        openedDocuments.get(map_key).save()
        const tag = openedDocuments.get(map_key).tag
        const temp_tags = listTags
        const found = listTags.find((e) => e === tag);
        if (!found) {
          temp_tags.push(tag)
        }
        setListTags(temp_tags)
        await fetchAll()
        return `${_.label}  saved`
      } catch (err) {
        throw err
      }
    })
  }


  const duplicate = async(data)=>{
    try {
      const document = await storage.get(data.value)
      const new_document = new NoteObject(storage)
      new_document.setLabel(document.value.label + ' copy')
      new_document.setContent(document.value.content)
      new_document.setTag(document.value.tag)
      new_document.save()
      listAllDocuments()
    } catch ( err) {
      throw err
    }
  }
  const deleteDocument = async(data)=>{
    try {
      const response = await storage.removeDocument(data)
      listAllDocuments()
      return `Document has been deleted`
    } catch (err) {
      throw err
    }
  }
  const deleteTag = async(data)=>{
    try {
      const tag = data.label

      for await (const entry of storage.createReadStream()) {
        const doc = entry.value
        if (doc.tag === tag) {
          await storage.remove(doc.id)
        }
      }

    } catch (err) {
      throw err
    }
  }
  const closeNote = (id)=>{
    openedDocuments.delete(id)
  }
  const closeAllNotes = ()=>{}

  useEffect(()=>{
    if (storage) {
      storage.on('update',()=>{
        listAllDocuments()
      })
    }
  },[storage])

  useEffect(()=>{
    if (storageReady) {
      listAllDocuments()
    }
  },[storageReady])

  return html`
<${DocumentContext.Provider} value=${{documentList,tagList,listAllDocuments, newDocument,openedDocuments,openDocument,save, duplicate,deleteDocument,deleteTag,closeNote,closeAllNotes}}>
  ${children}
<//>
`
}
