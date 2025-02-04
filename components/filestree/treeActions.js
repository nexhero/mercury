import {useEffect,useState} from 'react'
import {html} from 'htm/react'
import {Box, ActionIcon, Modal, Stack, TextInput, ColorPicker,Button } from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {IconTag, IconNote} from '@tabler/icons-react'
import { useNote,  activeNoteAtom } from '../../lib/core'
import {useAtomValue} from 'jotai'


/////////////////////////////////////////
// Component display available buttons //
// in the top of tag/notes tree        //
/////////////////////////////////////////
export default function TreeHeader(){
  const notes = useNote()
  const activeNote = useAtomValue(activeNoteAtom)


  ////////////////////////////////////////////////////////////
  // Create a new note                                      //
  // TODO: must create the text editor and setup auto-focus //
  ////////////////////////////////////////////////////////////
  const newNoteAction = ()=>{
    notes.createNote()
  }

  return(
    html`
        <${Box}>
            <${ActionIcon} onClick=${newNoteAction} variant="light" color="gray" aria-label="Note"><${IconNote}/></${ActionIcon}>
        </${Box}>
    `
  )
}
