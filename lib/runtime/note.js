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
  const saveNote = (id)=>{}
  const closeNote = (id)=>{
    openedNotes.delete(id)
  }
  const closeAllNotes = ()=>{}
  useEffect(()=>{
    console.log('opened notes',openedNotes)
  },[openedNotes])
  return html`
<${NoteContext.Provider} value=${{openedNotes,openNote,newNote,saveNote,closeNote,closeAllNotes}}>
  ${children}
<//>
`
}
