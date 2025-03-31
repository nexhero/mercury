import React, { useContext, useEffect, useState } from 'react'
import {html} from 'htm/react'
import {useAtomValue} from 'jotai'                       //TODO: REmove this
import { useNote,filetreeAtom } from '../../lib/core' //TODO Remove this
import {Button,Text,Modal,Container,Group,Box, Flex, Tree, ColorSwatch,Stack,rem,Menu,Title,Divider } from '@mantine/core'
import { useTree } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconChevronDown,
  IconCopy,
  IconWriting,
  IconTrash,
} from '@tabler/icons-react';
import TreeHeader from './treeActions'
import { useContextMenu } from 'mantine-contextmenu';
import { NotificationContext} from '../../lib/runtime/notification'
import { PeerContext } from '../../lib/peer'
import b4a from 'b4a'
import {Mercury} from '../../lib/runtime'
export default function FilesystemTree(){
  const {tableNote} = useContext(PeerContext)
  const listNotes = useAtomValue(filetreeAtom)

  const documents = Mercury.documents()
  const {storage} = Mercury.storage()
  const notes = useNote()
  const tree = useTree()
  const { showContextMenu } = useContextMenu();

  const noti = Mercury.noti()
  const [selectedNote,setSelectedNote] = useState(null) //Helper to store the selected tag or note to execute command from contextual menu
  const confirmDialog = useDisclosure(false)
  const [dialogMessage,setDialogMessage] = useState('')


  ///////////////////////////////////
  // Functions for contextual menu //
  ///////////////////////////////////
  const confirmDelete = (data)=>{
    documents.deleteDocument(data.value)
             .then((msg)=>noti.createInfo(msg))
             .catch((err)=>noti.createError(toString(err),'Unable to delete document'))
             .finally(()=>confirmDialog[1].close())
  }

  const onDelete = (data)=>{
    setSelectedNote(data)
    if (data.type !== 'tag') {
      setDialogMessage(`Delete "${data.label}"?`)
      confirmDialog[1].open()
    }else{
      // TODO: Remove documents recursive tags
      documents.deleteTag(data)
      setDialogMessage(`By removing the "${data.label}" tag, you are also deleting all associated notes.`)
      confirmDialog[1].open()
    }
  }
  const onDuplicate = (data)=>{
    notes.duplicate(data)
  }

  ////////////////////////////////////////
  // Setup for auto-update for incoming //
  // data from others peers             //
  ////////////////////////////////////////
  useEffect(()=>{

    documents.listAllDocuments()
    notes.fetchAll()
    tableNote.on('sync',(peer,data)=>{
      notes.fetchAll()
    })
    tableNote.on('connection',(peer)=>{
      noti.createInfo(`Peer connected ${b4a.toString(peer.remotePublicKey,'hex')}`)
    })
  },[])

  return(
    html`

    <${Stack}>
      <${Modal} opened=${confirmDialog[0]} onClose=${confirmDialog[1].close}>
        <${Text}>${dialogMessage}<//>
        <${Group} justify="flex-end">
          <${Button} onClick=${confirmDialog[1].close}>Cancel<//>
          <${Button} onClick=${()=>confirmDelete(selectedNote)}>Accept<//>
        <//>
      <//>
      <${Flex} gap="sm" justify="flex-end">

        <${TreeHeader}/>
      </${Flex}>

      <${Title} order=${5}>Notes<//>
      <${Divider} />

      <${Tree} data=${documents.documentList}
        tree=${tree}
        levelOffset=${18}
        renderNode=${({ node, expanded, hasChildren, elementProps }) => html`
      <${Group} gap=${5} ...${elementProps}>
      ${hasChildren && html`
              <${IconChevronDown}
                size=${18}
                style=${{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            `}
      <${Box}
    onContextMenu=${showContextMenu([
      {
        key:'duplicate',
        icon: html`<${IconCopy} size=${16} />`,
        title:'Duplicate',
        onClick:()=>onDuplicate(node)
      },
      {
        key:'delete',
        color: '#ff00ff',
        icon: html`<${IconTrash} size=${16} />`,
        title:'Delete',
        onClick:()=>onDelete(node)
      }
    ])}
    onClick=${()=>documents.openDocument(node.value)}>${node.label}</span>
      <//>
    `}
      />
    </${Stack}>

    `
  )
}
