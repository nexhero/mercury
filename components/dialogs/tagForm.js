import {html} from 'htm/react';
import {Modal,Box,Stack,Group,TextInput,Autocomplete,Button} from '@mantine/core';
import React, {createContext,useEffect,useState,useContext} from 'react';
import { useDisclosure } from '@mantine/hooks';
import {MercuryContext} from '../../lib/runtime/';
import {IconEmojiPicker,renderAutocompleteOpt} from '../index.js';
export const TagFormContext = createContext();
export const TagFormProvider = ({children})=>{
    const {tags,activeDoc,getBufferById,closeOneOpen} = useContext(MercuryContext);
    const [tagBuffer,setTagBuffer] = useState(null)
    const [opened,{open, close}] = useDisclosure(false);
    const [parent,setParent] = useState('');
    const [label,setLabel] = useState('');
    const [icon,setIcon] = useState('🏷')
    const save = ()=>{
      console.log('label is:',label)
        tagBuffer.setLabel(label);
        tagBuffer.setTag(parent);
        tagBuffer.setIcon(icon);
        tagBuffer.save()
        .then(()=>handleClose())
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
          const foundParent = tags.find((e)=>e.id==buff.tag)
          if (foundParent) {
          setParent(tags.find((e)=>e.id==buff.tag).label);
          }
          setIcon(buff.icon)
        }
    },[activeDoc])
    const renderAuto = ({option})=>{
        return html`
<${renderAutocompleteOpt} option=${option} setTag=${setParent}/>

`
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
          value=${label}
          onChange=${(e)=>setLabel(e.currentTarget.value)}
          required
          />

      </${Group}>

      <${Autocomplete}
        w="65%"
        placeholder="Parent"
        data=${tags}
        renderOption=${renderAuto}
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
