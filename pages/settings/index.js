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
  <${Box}>
    <${Modal}
      opened=${opened}
      onClose=${close}
      title="Settings"
      size="xl"
      centered
      >
      <${Tabs} orientation="vertical" color="lime" defaultValue="replicator">
        <${Tabs.List}>
          <${Tabs.Tab} value="replicator">Replicator</${Tabs.Tab}>
          <${Tabs.Tab} value="security">Security</${Tabs.Tab}>
          <${Tabs.Tab} value="shortcuts">Shortcuts</${Tabs.Tab}>
        </${Tabs.List}>

        <${Tabs.Panel} value="replicator"> <${SettingsReplicatorTab}/> </${Tabs.Panel}>

      </${Tabs}>
    </${Modal}>
    ${children}
  </${Box}>
</${SettingsPageContext.Provider}>

`;
};
