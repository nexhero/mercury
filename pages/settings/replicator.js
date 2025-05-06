import React,{useContext} from 'react';
import {html} from 'htm/react';
import {Container,Center,Stack,Paper, Button, TextInput, Group,Box} from '@mantine/core';
import { IconCopy, IconCheck, IconWorldMinus } from '@tabler/icons-react';
import { ActionIcon, CopyButton, Tooltip, Table, Badge } from '@mantine/core';
import {QRCodeSVG} from 'qrcode.react';
import {MercuryContext} from '../../lib/runtime';
export default function SettingsReplicatorTab() {
    const {mercury} = useContext(MercuryContext);
    return html`
<${Container}>
  <${Center}>
    <${Stack}>
      <${Group}>
        <${TextInput}
          w="40vw"
          description="Share you document with other devices"
          disabled
          value=${mercury?mercury.encodeRepository():''}
          />
        <${CopyButton} value=${mercury?mercury.encodeRepository():''}>
          ${({ copied, copy }) => html`
          <${Tooltip} label=${copied ? 'Copied' : 'Copy'} withArrow position="right">
            <${ActionIcon} color=${copied ? 'teal' : 'gray'} variant="subtle" onClick=${copy}>
              ${copied ? html`<${IconCheck} size=${16} />` : html`<${IconCopy} size=${16} />`}
            </${ActionIcon}>
          </${Tooltip}>
          `}
          </${CopyButton}>
        </${Group}>
      <${QRCodeSVG} size=${200} value=${mercury?mercury.encodeRepository():''}/>
      </${Stack}>
    </${Center}>
  </${Container}>
    `;
};
