import React from 'react';
import {html} from 'htm/react';
import {Group,Grid,AppShell,Burger, Title, ActionIcon} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {Header,Navbar, Editor} from '../components/';
export default function Shell(){
  const [opened,{toggle}] = useDisclosure();
  return html`

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
    <${Navbar}/>
  </${AppShell.Navbar}>
  <${AppShell.Main}>
    <${Editor}/>
  </${AppShell.Main}>
</${AppShell}>

`;
}
