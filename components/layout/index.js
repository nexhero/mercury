import React, { useContext, useEffect } from 'react'
import {html} from 'htm/react'
import {Group,Grid,AppShell,Burger, Title, ActionIcon} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import {IconSettings} from '@tabler/icons-react'
import Header from './header'
import FilesystemTree from '../filestree'
import NoteEditor from '../editor/index'
import { PeerContext} from '../../lib/peer'
import { useAtom} from 'jotai'
import notificationAtom from '../../lib/notification'
import { Notifications } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";

export default function Layout(){
  const [notificationMsg,setNotificationMsg] = useAtom(notificationAtom)
  const [opened, { toggle }] = useDisclosure();
  const {isReady} = useContext(PeerContext) //Wait for the peer initial state
  useEffect(()=>{
    if (notificationMsg) {
      notifications.show({
        title:notificationMsg.title,
        color:notificationMsg.color,
        message:notificationMsg.message,
        autoClose: 10000,
        onClose:()=>setNotificationMsg(null)

      })
    }
  },[notificationMsg])
  if (!isReady) {
    return(
      html`
        <h1>Loading...</h1>
      `
    )
  }

  return (
    html`
        <${AppShell}
            header=${{ height: 48 }}
            footer=${{ height: 36}}
            navbar=${{ width: 250, breakpoint: 'sm', collapsed:{mobile:!opened}}}
            padding="md"
            >

            <${AppShell.Header} >
                <${Header} toggle=${toggle} opened=${opened}/>
            </${AppShell.Header}>
            <${AppShell.Navbar} p="md" mt="30px">
                <${FilesystemTree}/>
            </${AppShell.Navbar}>

            <${AppShell.Main}>

                <${NoteEditor}/>

            </${AppShell.Main}>
        </${AppShell}>
    `
  )
}
