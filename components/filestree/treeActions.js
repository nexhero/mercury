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

//   useEffect(()=>{

// },[documents])
  ////////////////////////////////////////////////////////////
  // Create a new note                                      //
  // TODO: must create the text editor and setup auto-focus //
  ////////////////////////////////////////////////////////////
  const newDocumentAction = ()=>{
    documents.newDocument()
  }

  return(
    html`
        <${Box}>
            <${ActionIcon} onClick=${newDocumentAction} variant="light" color="gray" aria-label="Note"><${IconNote}/></${ActionIcon}>
        </${Box}>
    `
  )
}
