import React,{useContext} from 'react';
import {html} from 'htm/react';
import {Box,Group, ActionIcon} from '@mantine/core';
import {MercuryContext} from '../lib/runtime/index.js';
import {IconTag, IconNote, IconSettings} from '@tabler/icons-react';
import {SettingsPageContext} from '../pages/settings/';
export default function NavbarActions() {
const { createDocument} = useContext(MercuryContext);
const {openSettings} = useContext(SettingsPageContext);
return html`
<${Box} w="100%">
  <${Group} justify="space-between" gap="xs">
    <${ActionIcon} onClick=${openSettings} variant="light" color="gray" aria-label="Note"><${IconSettings}/></${ActionIcon}>
    <${ActionIcon} onClick=${createDocument} variant="light" color="gray" aria-label="Note"><${IconNote}/></${ActionIcon}>
  </${Group}>
</${Box}>
    `;
};
