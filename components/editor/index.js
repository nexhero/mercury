
import { html } from 'htm/react';
import {TextInput,Box, Stack,Button,Group} from '@mantine/core'
import EmptyEditor from './empty'
import Editor from './editor'

import { Tabs, ActionIcon } from '@mantine/core';
import { IconX } from '@tabler/icons-react';


import {Mercury} from '../../lib/runtime'
import { useContext, useEffect, useState } from 'react';
export default function NoteEditor() {
  const documents = Mercury.documents()
  const [tabs,setTabs] = useState([])
  const [panels,setPanels] = useState([])

  const onCloseTab = (k)=>{
    documents.closeDocument(k)
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
      html`<p>Loading Documents</>`
    )
  }

  if (documents.openedDocuments.size) {
    return (
      html`
      <${Box}>
        <${Tabs} value=${documents.activeDoc} onChange=${documents.setActiveDoc} >
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
