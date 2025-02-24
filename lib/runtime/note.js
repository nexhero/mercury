import React, { createContext, useEffect,useState} from 'react'
import {html} from 'htm/react'

export const NoteContext = createContext()
export const NoteProvider = ({children})=>{
  const [openedNotes,setOpenedNotes] = useState(new Map())
}
