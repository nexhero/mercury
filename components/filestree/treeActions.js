import { useContext, useEffect,useState} from 'react'
import {html} from 'htm/react'
import {Box, ActionIcon, Modal, Stack, TextInput, ColorPicker,Button } from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {IconTag, IconNote} from '@tabler/icons-react'

// *** New imports to manage notes files
import {Mercury} from '../../lib/runtime'

/////////////////////////////////////////
// Component display available buttons //
// in the top of tag/notes tree        //
/////////////////////////////////////////
export default function TreeHeader(){

  const documents = Mercury.documents()

  useEffect(()=>{
    console.log('documents in tree-actions',documents)
},[documents])
  ////////////////////////////////////////////////////////////
  // Create a new note                                      //
  // TODO: must create the text editor and setup auto-focus //
  ////////////////////////////////////////////////////////////
  const newNoteAction = ()=>{
    console.log(documents)
    documents.newDocument()

  }

  return(
    html`
        <${Box}>
            <${ActionIcon} onClick=${newNoteAction} variant="light" color="gray" aria-label="Note"><${IconNote}/></${ActionIcon}>
        </${Box}>
    `
  )
}
