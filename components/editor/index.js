import React, {useEffect,useContext,useState} from 'react';
import { html } from 'htm/react';
import {TextInput,Box, Stack,Button,Group,Tabs, ActionIcon} from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import RichEditor from './richEditor';
import {MercuryContext} from '../../lib/runtime';
export default function Editor(){
  const {openedDocs,closeOneOpen,activeDoc,setActiveDoc} = useContext(MercuryContext);
  const [tabs,setTabs] = useState([]);
  const [panels,setPanels] = useState([]);
  /**
   * Close on tab by document id
   * @param {String} t - Document ID
   */
  const handleCloseTab = (t)=>{
    closeOneOpen(t);
  };
  useEffect(()=>{


      const genPanels =[]
      const genTabs = []
      openedDocs
        .entries().forEach(([key,value])=>{
          console.log('key,value:',key,value)
          if (value.type!=='TAG') {
            genTabs.push(
                    html`
<${Group} key=${key}>
  <${Tabs.Tab} key=${key} value=${key}>
    ${value.label}
  </${Tabs.Tab}>
  <${ActionIcon} size="sm"  onClick=${() => {handleCloseTab(key);}}>
    <${IconX}/>
  </${ActionIcon}>
</${Group}>
  `

            )
            genPanels.push(
              html`
<${Tabs.Panel} key=${key} value=${key}>
  <${Box}>
    <${RichEditor} document=${value}/>
  </${Box}>
</${Tabs.Panel}>`
            )
          }
        })
      setPanels(genPanels);
      setTabs(genTabs);


           },[openedDocs.size]);

if (openedDocs.size) {
  return html`
<${Box}>
  <${Tabs} value=${activeDoc} onChange=${setActiveDoc}>
    <${Tabs.List}>
      <${Group} gap="lg">
        ${tabs}
      </${Group}>
    </${Tabs.List}>
    ${panels}
  </${Tabs}>
</${Box}>
  `;
}else{
  return html`
<${Box}>
  <h1>Empty</h1>
</${Box}>
  `;
}

}
