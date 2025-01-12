import  React, {useEffect,useState} from 'react'
import {atom,useSetAtom,useAtomValue, useAtom } from 'jotai'


// Define data atom
const notes = atom([])
const _activeTagAtom = atom(null)
// TODO: Replace demo db
const data = [
  {
    type:"tag",
    value:"t001",
    label:'Tag1',
    color:"#F2E751",
    children:[
      {
        type:"note",
        value:"n001",
        label:"My Todo LIST"
      },
      {
        type:"note",
        value:"n002",
        label:"Mercury project idea"
      }
    ],

  },
  {
    type:"tag",
    value:"t002",
    label:'Red Tag',
    color:"#D85E5E",
    children:[
      {
        type:"note",
        value:"n002",
        label:"Note in red"
      }
    ],
  },

  {
    type:"note",
    value:"n003",
    label:"Note on root"
  }
]
// Helper function to generate new id
export function generateId(){
  const _id = Math.random().toString(36).substring(2,9)
  return _id
}
function useMercury(){
  const setNotes = useSetAtom(notes)
  setNotes(data)
  console.log('using mercury')
}
function useNoteFn(){
  const notesList = useAtom(notes)
  const addNote = (parent = null)=>{
    console.log('creating note in:',parent)
  }
  return{addNote:addNote}
}
function useTagFn(){
  const setActiveTag = useSetAtom(_activeTagAtom)
  const setNotes = useSetAtom(notes)
  const notesList = useAtomValue(notesAtom)

  // TODO: Add to write into the hyperbee
  const addTag = async (data)=>{
    setNotes((p)=>[...p,data])
  }

  return {addTag:addTag, setActiveTag:setActiveTag}
}
export const notesAtom = notes
export const activeTagAtom = _activeTagAtom
export const useTag = useTagFn
export const useNote = useNoteFn
export default useMercury
