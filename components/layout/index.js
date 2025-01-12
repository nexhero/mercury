import {html} from 'htm/react'
import {Group,Grid,AppShell,Burger, Title, ActionIcon} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks';
import {IconSettings} from '@tabler/icons-react'
import Header from './header'
import FilesystemTree from '../filestree'
import NoteEditor from '../editor/index'

export default function Layout(){
      const [opened, { toggle }] = useDisclosure();

  return (
    html`
        <${AppShell}
            header=${{ height: 48 }}
            navbar=${{ width: 250, breakpoint: 'sm', collapsed:{mobile:!opened}}}
            padding="md"
            >

            <${AppShell.Header} mt="30px" >
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
