import React, { useContext, useEffect, useState } from 'react'
import {html} from 'htm/react'
import {Group,Grid,AppShell,Burger, Title, ActionIcon} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import {IconSettings} from '@tabler/icons-react'
import Header from './header'
import FilesystemTree from '../filestree'
import NoteEditor from '../editor/index'

import { Notifications } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";
import { Mercury } from '../../lib/runtime';

export default function Layout(){
  const [opened, { toggle }] = useDisclosure();
  const {storageReady} = Mercury.storage()
  const isReady = storageReady


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
