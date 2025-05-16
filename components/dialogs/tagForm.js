import {html} from 'htm/react';
import {Modal,Box,Stack,Group,TextInput,Autocomplete,Button} from '@mantine/core';
import React, {createContext,useEffect,useState,useContext} from 'react';
import { useDisclosure } from '@mantine/hooks';
import {MercuryContext} from '../../lib/runtime/';
import {IconEmojiPicker} from '../index.js';
export const TagFormContext = createContext();
export const TagFormProvider = ({children})=>{
    const {tags,activeDoc,getBufferById,closeOneOpen} = useContext(MercuryContext);
    const [tagBuffer,setTagBuffer] = useState(null)
    const [opened,{open, close}] = useDisclosure(false);
    const [parent,setParent] = useState('');
    const [label,setLabel] = useState('');
    const [icon,setIcon] = useState('🏷')
    const save = ()=>{
        tagBuffer.setLabel(label);
        tagBuffer.setTag(parent);
        tagBuffer.setIcon(icon);
        tagBuffer.save()
            .then(()=>console.log('Tag saved'))
            .catch((err)=>console.log('unable to save tag'))
    }
    const handleClose = ()=>{
        close();
        closeOneOpen(tagBuffer.id);

    }
    useEffect(()=>{
        const buff = getBufferById(activeDoc)
        setTagBuffer(buff)
        if(buff?.type === 'TAG'){
            setLabel(buff.label)
            setParent(buff.parent?buff.parent:'')
        }
    },[activeDoc])

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
        <${Button} onClick=${save}>Save</$Button>
</${Box}>
</${Stack}>

</${Modal}>
${children}
</${TagFormContext.Provider}>
    `

}
