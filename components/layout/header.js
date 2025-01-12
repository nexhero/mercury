import {html} from 'htm/react'
import {Group,Title,Burger,ActionIcon} from '@mantine/core'
import {IconSettings} from '@tabler/icons-react'

export default function Header({toggle,opened}){
  const onSettingsClick = ()=>{
    console.log('Settings button :)')
  }
  return(
    html`
        <${Group} h="100%" px="md">
            <${Burger} opened=${opened} onClick=${toggle} hiddenFrom="sm" size="sm" />
            <${Title} order=${5}>Mercury</${Title}>
            <${ActionIcon} onClick=${onSettingsClick} variant="light" color="gray" aria-label="Tag"><${IconSettings}/></${ActionIcon}>
        </${Group}>
    `
  )
}
