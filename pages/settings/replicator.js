/////////////////////////////////////////////
// Settings Page for setup replicators     //
// allow user to share the local documents //
// with other devices                      //
/////////////////////////////////////////////

// List things TODO
// TODO:QR code centered
// TODO:Input & button copy must be in the same row
// TODO:Add replicator
// TODO:Remove replicator
// TODO:Display connected peers

import React,{useState,useContext} from 'react';
import {html} from 'htm/react';
import {Divider,Title,Container,Center,Stack,Paper, Button, TextInput,Textarea, Group,Box} from '@mantine/core';
import { IconCopy, IconCheck, IconWorldMinus } from '@tabler/icons-react';
import { ActionIcon, CopyButton, Tooltip, Table, Badge } from '@mantine/core';
import {QRCodeSVG} from 'qrcode.react';
import {MercuryContext} from '../../lib/runtime';
export default function SettingsReplicatorTab() {
  const {mercury} = useContext(MercuryContext);
  const [name,setName] = useState('');
  const [channel,setChannel] = useState('');

  const addRepo = ()=>{
    mercury.joinRemoteRepository(channel,name)
      .then(()=>console.log('repo added'))
      .catch((err)=>console.log(`ERROR:${String(err)}`));
    console.log('adding repository');
  };
  return html`
<${Container}>
  <${Center}>
    <${Stack} >

      <${Divider} label="Local Repository" labelPosition="center"/>
      <${Group} justify="space-between" wrap="nowrap" preventGrowOverflow={false} align="center">

        <${TextInput}
          w="30vw"
          description="Share your documents with other devices"
          disabled
          value=${mercury?mercury.encodeRepository():''}
          />

        <${CopyButton} value=${mercury?mercury.encodeRepository():''}>
          ${({ copied, copy }) => html`
    <${Tooltip} label=${copied ? 'Copied' : 'Copy'} withArrow position="right">
    <${ActionIcon} color=${copied ? 'teal' : 'gray'} variant="subtle" onClick=${copy}>
    ${copied ? html`<${IconCheck} size=${18} />` : html`<${IconCopy} size=${18} />`}
  </${ActionIcon}>
    </${Tooltip}>
    `}
          </${CopyButton}>
        </${Group}>

      <${Box} w="100%" align="center">
        <${QRCodeSVG} size=${200} value=${mercury?mercury.encodeRepository():''}/>
      </${Box}>

  <${Divider} style=${{marginTop:20}} label="Append Repository" labelPosition="center"/>
      <${Stack} align="center">
        <${TextInput} value=${name} onChange=${(e)=>setName(e.target.value)} w="30vw" placeholder="Name Channel"/>
        <${Textarea} minRows=${7} maxRows=${7} value=${channel} onChange=${(e)=>setChannel(e.target.value)} w="30vw" placeholder="Remote Channel"/>
        <${Box} w="10%"> <${Button} onClick=${addRepo} variant="filled">Add</${Button}></${Box}>
      </${Stack}>

      <${Divider} style=${{marginTop:20}} label="Repository List" labelPosition="center"/>
      <${Box}>
        <${Table}>
          <${Table.Thead}>
            <${Table.Tr}>
              <${Table.Th}>Name</${Table.Th}>
              <${Table.Th}>Peer</${Table.Th}>
              <${Table.Th}>Status</${Table.Th}>
            </${Table.Tr}>
          </${Table.Thead}>
        </${Table}>
      </${Box}>
      </${Stack}>
    </${Center}>
  </${Container}>
    `;
};
