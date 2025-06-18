/*#+ORG
* Tabs
** DONE Replicator
** TODO Shortcuts
** TODO Security/Backup
** TODO Theme
User can customize the colors of the application, the theme
must be available for all devices
** IDEA AI
Add AI services for creting documents,reminders,etc...
probably using a rest api service, like Ollama

#+END_ORG*/
import {html} from 'htm/react';
import {Modal,Box} from '@mantine/core';
import { Tabs } from '@mantine/core';
import React, {createContext,useEffect,useState,useContext} from 'react';
import { useDisclosure } from '@mantine/hooks';
import SettingsReplicatorTab from './replicator';

export const SettingsPageContext = createContext();
export const  SettingsPageProvider=({children})=>{
    const [opened,{open,close}] =  useDisclosure(false);

    return html`
<${SettingsPageContext.Provider} value=${{opened,openSettings:open,closeSettings:close}}>

    <${Modal}
      opened=${opened}
      onClose=${close}
      title="Settings"
      size="xl"
      centered
      >
      <${Tabs} orientation="vertical" color="lime" defaultValue="replicator">
        <${Tabs.List} h="80vh">
          <${Tabs.Tab} value="replicator">Replicator</${Tabs.Tab}>
          <${Tabs.Tab} value="shortcuts">Shortcuts</${Tabs.Tab}>
          <${Tabs.Tab} value="security">Backup</${Tabs.Tab}>
        </${Tabs.List}>
        <${Tabs.Panel} value="replicator"> <${SettingsReplicatorTab}/> </${Tabs.Panel}>
      </${Tabs}>
    </${Modal}>
    ${children}

</${SettingsPageContext.Provider}>

`;
};
