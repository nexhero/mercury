///////////////////////////////
// Manage the opened objects //
///////////////////////////////

// TODO: Rename file to documents
//FIXME: When open or creating new document set the tab focus to the new note
import React, { createContext, useContext, useEffect,useState} from 'react'
import {useMap} from '@mantine/hooks'
import {html} from 'htm/react'
// import {NoteClass} from '../filesystem'
import {StorageContext} from './storage'
import NoteObject from '../object/noteObject'
// import { PeerContext } from '../peer'
export const DocumentContext = createContext()
export const DocumentProvider = ({children})=>{
  const openedDocuments = useMap([])
  // const {tableNote} = useContext(PeerContext)
  const [tagList,setTagList] = useState([])
  const [documentList,setDocumentList] = useState([])
  const {storage} = useContext(StorageContext)

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

  const openNote = async(id)=>{
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


  const duplicate = (data)=>{
    return new Promise(async(resolve,reject)=>{
      if (data.type === 'note') {
        const document = await tableNote.get(data.value)
        const newNote = new NoteClass()
        newNote.setContent(_note.value.content)
        newNote.setLabel(_note.value.label + ' copy')
        newNote.setTag(_note.value.tag)
        await tableNote.put(newNote.id,newNote.toJson())
        fetchAll()
        resolve(newNote.label + 'saved')
      }else{
        reject('Unable to duplicate')
      }
    })
  }
  const remove = (data)=>{
    return new Promise(async(resolve,reject)=>{
      try {
        if (data.type==='note') {
          await tableNote.remove(data.value)
        }else{
          const tag = data.label
          // for await (const entry of tableNote.createReadStream()) {
          for await (const entry of tableNote.createReadStream()) {
            const _note = entry.value
            if (_note.tag === tag) {
              await tableNote.remove(_note.id)
            }
          }
        }
        resolve(data.label +' Removed')
        fetchAll()

      } catch (err) {
        reject(err)
      }
    })
  }
  const closeNote = (id)=>{
    openedDocuments.delete(id)
  }
  const closeAllNotes = ()=>{}
  useEffect(()=>{
    if (storage) {
    storage.on('save',(k)=>{
      listAllDocuments()
    })
    }

  },[storage])
  useEffect(()=>{
    console.log('Tag list updated',tagList)
  },[tagList])
  useEffect(()=>{
    console.log('opened notes',openedDocuments)
  },[openedDocuments])

  return html`
<${DocumentContext.Provider} value=${{documentList,tagList,listAllDocuments, newDocument,openedDocuments,openNote,save, duplicate,remove,closeNote,closeAllNotes}}>
  ${children}
<//>
`
}
