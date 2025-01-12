import {useEffect,useState} from 'react'
import {html} from 'htm/react'
import {Box, ActionIcon, Modal, Stack, TextInput, ColorPicker,Button } from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import {IconTag, IconNote} from '@tabler/icons-react'
import {useTag,useNote,activeTagAtom, generateId} from '../../lib/core'
import {useAtomValue} from 'jotai'

export default function TreeHeader(){
  const [renderTrigger, setRenderTrigger] = useState(false);
  const activeTag = useAtomValue(activeTagAtom)
  const [opened, { open, close }] = useDisclosure(false);
  const [tagName,setTagName] = useState('') //Store the creating tag name
  const [color,setColor] = useState('') //Color selected for the new tag
  const tag = useTag()
  const notes = useNote()
  const openTagDialog = ()=>{
    open()
  }
  const newTagAction = ()=>{
    console.log('creating new tag')
    const data = {
      type:"tag",
      value:generateId(),             //This should be the id
      label:tagName,
      color:color,
    }
    tag.addTag(data)
    close()
  }
  const newNoteAction = ()=>{
    console.log(activeTag)
    notes.addNote()
  }

  return(
    html`
        <${Box}>
            <${Modal} opened=${opened} onClose=${close} title="New Tag" centered>
              <${Stack} align="center" justify="center">
                <${TextInput}
                  onChange=${(e)=>setTagName(e.currentTarget.value)}
                  value=${tagName}
                  label="Name"
                />
                <${ColorPicker}
                  swatches=${['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
                  value=${color}
                  onChange=${setColor}/>
              </${Stack}>
              <${Box} w="100%" align="flex-end">
                  <${Button} onClick=${newTagAction}>Save</${Button}>
              </${Box}>
            </${Modal}>

            <${ActionIcon} onClick=${openTagDialog} variant="light" color="gray" aria-label="Tag"><${IconTag}/></${ActionIcon}>
            <${ActionIcon} onClick=${newNoteAction} variant="light" color="gray" aria-label="Note"><${IconNote}/></${ActionIcon}>
        </${Box}>
    `
  )
}
