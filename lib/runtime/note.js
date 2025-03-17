///////////////////////////////
// Manage the opened objects //
///////////////////////////////
// TODO: Rename file to documents
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
  const {storage} = useContext(StorageContext)

  const newDocument = (id)=>{
    const _new = new NoteObject(storage)
    openedDocuments.set(_new.id,_new)
  }

  const openNote = async(id)=>{
    const entry = await tableNote.get(id)
    if (entry) {
      const _record = new NoteClass(entry.value)
      openedDocuments.set(_record.id,_record)
    }
  }
  const save = async(data)=>{
    return new Promise(async(resolve,reject)=>{
      console.log('saving....',data)
      try {
        const _ = {
          id: data.id,
          label: data.label,
          content: data.content,
          created_at: data.created_at?data.created_at:new Date().toString(),
          updated_at: new Date().toString(),
          type: data.type?data.type:"note",
          tag:data.tag?data.tag:''
        }

        tableNote.put(_.id,_)
        const temp_tags = listTags
        const found = listTags.find((e) => e === _.tag);
        if (!found) {
          temp_tags.push(_.tag)
        }
        setListTags(temp_tags)
        await fetchAll()
        resolve(_.label + ' saved')
      } catch (err) {
        reject(err)
      }

    })
  }


    const duplicate = (data)=>{
    return new Promise(async(resolve,reject)=>{
      if (data.type === 'note') {
        const _note = await tableNote.get(data.value)
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
    console.log('opened notes',openedDocuments)
  },[openedDocuments])
  return html`
<${DocumentContext.Provider} value=${{newDocument,openedDocuments,openNote,save, duplicate,remove,closeNote,closeAllNotes}}>
  ${children}
<//>
`
}
