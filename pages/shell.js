/*#+ORG
This file represne the skeleton of the application
here will be all the entry points
for all dialogs, which must be managed as context
to easy access for any other components
* TODO:
** [ ] Fix title `Mercury`.
Give some space at the left size
** [ ] Move SettingsProvider compnent under appshell.
Enable a global access for other components
** IDEA Add Application icon.

#+END_ORG*/
import React from 'react';
import {html} from 'htm/react';
import {Group,Grid,AppShell,Burger, Title, ActionIcon} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {Header,Navbar, Editor, DialogCluster} from '../components/';
import {SettingsPageProvider} from './settings/';
export default function Shell(){
  const [opened,{toggle}] = useDisclosure();
  return html`

<${AppShell}
  header=${{ height: 48 }}
  footer=${{ height: 36}}
  navbar=${{ width: 250, breakpoint: 'sm', collapsed:{mobile:!opened}}}
  padding="md"
  >
  <${DialogCluster}>
  <${AppShell.Header} >
    <${Header} toggle=${toggle} opened=${opened}/>
  </${AppShell.Header}>
  <${AppShell.Navbar} p="md" mt="30px">
    <${SettingsPageProvider}>
    <${Navbar}/>
    </${SettingsPageProvider}>
  </${AppShell.Navbar}>
  <${AppShell.Main}>
    <${Editor}/>
  </${AppShell.Main}>
  </${DialogCluster}>
</${AppShell}>

`;
}
