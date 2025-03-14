///////////////////////////////
// Manage the opened objects //
///////////////////////////////

import React, { createContext, useContext, useEffect,useState} from 'react'
import {useMap} from '@mantine/hooks'
import {html} from 'htm/react'
import {NoteClass} from '../filesystem'
import { PeerContext } from '../peer'
export const NoteContext = createContext()
export const NoteProvider = ({children})=>{
  const openedNotes = useMap([])
  const {tableNote} = useContext(PeerContext)

  const newNote = (id)=>{
    const _new = new NoteClass()
    openedNotes.set(_new.id,_new)

  }

  const openNote = async(id)=>{
    const entry = await tableNote.get(id)
    if (entry) {
      const _record = new NoteClass(entry.value)
      openedNotes.set(_record.id,_record)
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
    openedNotes.delete(id)
  }
  const closeAllNotes = ()=>{}
  useEffect(()=>{
    console.log('opened notes',openedNotes)
  },[openedNotes])
  return html`
<${NoteContext.Provider} value=${{openedNotes,openNote,newNote,save, duplicate,remove,closeNote,closeAllNotes}}>
  ${children}
<//>
`
}
