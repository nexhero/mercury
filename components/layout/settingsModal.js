import {html} from 'htm/react';
import {Modal} from '@mantine/core';
import { Tabs } from '@mantine/core';
import {Replicator} from './settings'
export default function SettingsModal({opened, onClose}){
  return(
    html`
        <${Modal}
            opened=${opened}
            onClose=${onClose}
            title="Settings"
            fullScreen
         >
            <${Tabs} color="lime" defaultValue="replicator">
                <${Tabs.List}>
                    <${Tabs.Tab} value="replicator">Replicator<//>
                    <${Tabs.Tab} value="security">Security<//>
                    <${Tabs.Tab} value="shortcuts">Shortcuts<//>
                <//>
                <${Tabs.Panel} value="replicator"><${Replicator}/><//>

            <//>
         <//>
        `
  )
}
