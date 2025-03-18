
import { html } from 'htm/react';
import {TextInput,Box, Stack,Button,Group} from '@mantine/core'
import EmptyEditor from './empty'
import Editor from './editor'
import {activeNoteAtom} from '../../lib/core'
import {useAtomValue} from 'jotai'

import { Tabs, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import {DocumentContext} from '../../lib/runtime/note'

import {Mercury} from '../../lib/runtime'
import { useContext, useEffect, useState } from 'react';
export default function NoteEditor() {
  // const {openedNotes,closeNote} = Mercury.documents()
  const documents = Mercury.documents()
  const activeNote = useAtomValue(activeNoteAtom)
  const [tabs,setTabs] = useState([])
  const [panels,setPanels] = useState([])
  const onCloseTab = (k)=>{
    documents.closeNote(k)
  }

  useEffect(()=>{
    try {
      setTabs(Array.from(documents.openedDocuments.entries()).map(([key, value]) => (
    html`
        <${Group} key=${key}>
          <${Tabs.Tab} key=${key} value=${key} > ${value.label}<//>
                      <${ActionIcon} size="sm"  onClick=${() => {onCloseTab(key)}}>
              <${IconX}/>
            </${ActionIcon}>
        <//> `
  )))

      setPanels(Array.from(documents.openedDocuments.entries()).map(([key, value]) => (
    html`
      <${Tabs.Panel} key=${key} value=${key}>
        <${Box}>
          <${Editor} activeNote=${value}/>
        <//>
        <//>`
  )))
    } catch (err) {
      console.log('unable to load documents')
    }
  },[documents])


  if (!documents) {
    return (
      html`<p>Loading notes...</>`
    )
  }
  if (documents.openedDocuments.size) {
    return (
      html`
      <${Box}>
        <${Tabs} defaultValue=${documents.openedDocuments.entries().next().value[0]}>
          <${Tabs.List}>
            <${Group} gap="lg">
              ${tabs}
            </${Group}>
          <//>
            ${panels}
        <//>
      <//>
      `
    )
  }else{
  return (
    html`
    <${Box}>
      <${EmptyEditor}/>
  </${Box}>
`
  );
  }
}
