import { html } from 'htm/react';
import {TextInput,Box, Stack,Button,Group} from '@mantine/core'
import EmptyEditor from './empty'
import Editor from './editor'
import {activeNoteAtom} from '../../lib/core'
import {useAtomValue} from 'jotai'

import { Tabs, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import {NoteContext} from '../../lib/runtime/note'
import { useContext, useEffect } from 'react';
export default function NoteEditor() {
  const {openedNotes,closeNote} = useContext(NoteContext)
  const activeNote = useAtomValue(activeNoteAtom)

  const onCloseTab = (k)=>{
    closeNote(k)
  }

  const tabs = Array.from(openedNotes.entries()).map(([key, value]) => (
    html`
        <${Group} key=${key}>
          <${Tabs.Tab} key=${key} value=${key} > ${value.label}<//>
                      <${ActionIcon} size="sm"  onClick=${() => {onCloseTab(key)}}>
              <${IconX}/>
            </${ActionIcon}>
        <//> `
  ))

  const panels = Array.from(openedNotes.entries()).map(([key, value]) => (
    html`
      <${Tabs.Panel} key=${key} value=${key}>
        <${Box}>
          <${Editor} activeNote=${value}/>
        <//>
        <//>`
  ))

  if (openedNotes.size) {
    return (
      html`
      <${Box}>
        <${Tabs} defaultValue=${openedNotes.entries().next().value[0]}>
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
