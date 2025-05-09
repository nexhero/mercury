import React from 'react'
import {html} from 'htm/react'
import {Flex,Group,Title,Burger,ActionIcon} from '@mantine/core'
import {IconSettings} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks';
import SettingsModal from './settingsModal'
import {Modal} from '@mantine/core';
export default function Header({toggle,opened}){
  const [settingsModal, settingsModalMethod] = useDisclosure(false);

  const onSettingsClick = ()=>{
    settingsModalMethod.open()
  }
  return(
    html`

        <${Group} px="md">
            <${SettingsModal} opened=${settingsModal} onClose=${settingsModalMethod.close}>ok!<//>
            <${Burger} opened=${opened} onClick=${toggle} hiddenFrom="sm" size="sm" />
            <${Title} order=${5}>Mercury</${Title}>
            <${ActionIcon} onClick=${onSettingsClick} variant="light" color="gray" aria-label="Tag"><${IconSettings}/></${ActionIcon}>
            <${Group} style=${{flex:'auto'}} mx="auto" justify="flex-end"><pear-ctrl></pear-ctrl><//>
        </${Group}>

    `
  )
}
