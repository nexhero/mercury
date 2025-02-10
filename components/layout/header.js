import {html} from 'htm/react'
import {Flex,Group,Title,Burger,ActionIcon} from '@mantine/core'
import {IconSettings} from '@tabler/icons-react'

export default function Header({toggle,opened}){
  const onSettingsClick = ()=>{
    console.log('Settings button :)')
  }
  return(
    html`
        <${Group} px="md">
            <${Burger} opened=${opened} onClick=${toggle} hiddenFrom="sm" size="sm" />
            <${Title} order=${5}>Mercury</${Title}>
            <${ActionIcon} onClick=${onSettingsClick} variant="light" color="gray" aria-label="Tag"><${IconSettings}/></${ActionIcon}>
            <${Group} style=${{flex:'auto'}} mx="auto" justify="flex-end"><pear-ctrl></pear-ctrl><//>
      </${Group}>
    `
  )
}
