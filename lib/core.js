import  React, {useEffect,useState, useContext} from 'react'
import {atom,useSetAtom,useAtomValue, useAtom } from 'jotai'
import {NoteClass} from './filesystem'
import {PeerContext} from './peer'

// Define data atom
const notes = atom([])               // Manage the tags and notes saved TODO:Remove notes, no required anymore
const _activeNoteAtom = atom(null)  //Manage note editor
const _listTags = atom([])            //List of the current tag
const _filetree = atom([])               //Manage the all notes grouped by tag

// Hook function to add new note into the hyperbee
// NOTE: Missing code for saving into the hyperbee
function useNoteFn(){

  const {tableNote} = useContext(PeerContext)
  const [activeNote,setActiveNote] = useAtom(_activeNoteAtom)
  const [listTags,setListTags] = useAtom(_listTags)
  const [filetree,setFiletree] = useAtom(_filetree)
  const createNote = ()=>{
    const n = new NoteClass()
    setActiveNote(n)
  }
  /////////////////////////////////////////////
  // Save or update a note into the hyperbee //
  /////////////////////////////////////////////
  const save = async(data)=>{
    return new Promise(async(resolve,reject)=>{
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
        await tableNote.put(_.id,_)
        const temp_tags = listTags
        const found = listTags.find((e) => e === _.tag);
        if (!found) {
          temp_tags.push(_.tag)
        }
        setListTags(temp_tags)
        fetchAll()
        resolve(_.label + ' saved')
      } catch (err) {
        reject(err)
      }

    })
  }

  const removeNote = ()=>{
    console.log('removing note')
  }
  const openNote = async(id)=>{
    const entry = await tableNote.get(id)
    if (entry) {
      const n = new NoteClass(entry.value)
      setActiveNote(n)
    }
  }
  const fetchAll = async()=>{
    return new Promise(async(resolve,reject)=>{
      try {
        const arr = []
        const tagBatch = []
        for await (const entry of tableNote.createReadStream()) {
          const _note = entry.value
          const indexTag = arr.findIndex((t)=>t.value === _note.tag)
          // Note has a tag
          if (_note.tag) {
            if (indexTag>=0) {
              arr[indexTag].children.push({
                label:_note.label,
                value:_note.id,
                type:'note',
                children:[]
              })
            }else{
              arr.push({
                label: _note.tag,
                value: _note.tag,
                children: [],
                type:'tag'
              })
              tagBatch.push(_note.tag)
              arr[arr.length-1].children.push({
                label:_note.label,
                value:_note.id,
                type:'note',
                children:[]
              })
            }
            // note has no tag, and is added to the root
          }else{
            arr.push({
              label: _note.label,
              value: _note.id,
              children: [],
              type:'note'
            })
          }
        }
        setFiletree(arr)
        setListTags(tagBatch)
        resolve(arr)
      } catch (err) {
        reject(err)
      }
    })
  }

  return{
    createNote,
    save,
    removeNote,
    fetchAll,
    openNote
  }
}


export const listTagAtom = _listTags
export const filetreeAtom = _filetree
export const notesAtom = notes
export const activeNoteAtom = _activeNoteAtom
export const useNote = useNoteFn
