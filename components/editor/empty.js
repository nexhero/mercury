import {html} from 'htm/react'
import { Center, Box, Image, Text, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useContext } from 'react';
import { NoteContext } from '../../lib/runtime/note';
import SettingsModal from '../layout/settingsModal'

export default function EmptyEditor(){
  const [settingsModal, settingsModalMethod] = useDisclosure(false);
  const notes = useContext(NoteContext)
  const onSettingsClick = ()=>{
    settingsModalMethod.open()
  }
  return(
    html`
  <${Box}>
         <${SettingsModal} opened=${settingsModal} onClose=${settingsModalMethod.close}/>
        <${Center}>
          <${Text} size="xl"
      fw=${900}
      variant="gradient"
      gradient=${{ from: 'teal', to: 'lime', deg: 230 }}
            >
              Mercury – The P2P Note-Taking App!
          <//>
          <//>

          <${Text}>
            Take control of your notes with a fully decentralized, peer-to-peer system. No servers, no middlemen—just you and your data.
          </${Text}>

          <${Text}>
          Create a new file to start fresh with secure, private notes. <${Button} variant="subtle" onClick=${notes.newNote}> Click here</${Button}>
          </${Text}>

        <${Text}>

        Connect to a repository to sync and collaborate seamlessly. <${Button} variant="subtle" onClick=${onSettingsClick}>Click Here</>
        </${Text}>

    <${Text}>
      Your notes, your rules. Get started now! 🚀
    </${Text}>

  <//>
    `
  )
}
