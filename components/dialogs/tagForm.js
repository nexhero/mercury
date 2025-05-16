import {html} from 'htm/react';
import {Modal,Box,Stack,Group,TextInput,Autocomplete,Button} from '@mantine/core';
import React, {createContext,useEffect,useState,useContext} from 'react';
import { useDisclosure } from '@mantine/hooks';
import {MercuryContext} from '../../lib/runtime/';
import {IconEmojiPicker} from '../index.js';
export const TagFormContext = createContext();
export const TagFormProvider = ({tag=null,children})=>{
    const [opened,{open, close}] = useDisclosure(false);
    const {tags} = useContext(MercuryContext);
    const [parent,setParent] = useState('');
    const [label,setLabel] = useState('');
    const [icon,setIcon] = useState('🏷')
    const save = ()=>{
        console.log('Saving document')
    }
    return html`
<${TagFormContext.Provider} value=${{opened,openTagForm:open,closeTagForm:close}}>
  <${Modal}
    opened=${opened}
    onClose=${close}
    centered
    >

    <${Stack} align="center">
      <${Group} justify="space-between" wrap="nowrap" preventGrowOverflow={false} align="center">
        <${IconEmojiPicker}
          value=${icon}
          onChange=${setIcon}
          />

        <${TextInput}
          placeholder="Tag title"
          required
          />

      </${Group}>

        <${Autocomplete}
          w="65%"
          placeholder="Parent"
          data=${tags}
          value=${parent}
          onChange=${setParent}
          />
        <${Box} w="24%">
          <${Button}>Save</$Button>
        </${Box}>
    </${Stack}>

  </${Modal}>
  ${children}
</${TagFormContext.Provider}>
    `

}
