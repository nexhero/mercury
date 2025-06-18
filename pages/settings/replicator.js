/////////////////////////////////////////////
// Settings Page for setup replicators     //
// allow user to share the local documents //
// with other devices                      //
/////////////////////////////////////////////

// FIXME:Input & button copy must be in the same row

import React,{useEffect,useState,useContext} from 'react';
import {html} from 'htm/react';
import {Divider,Title,Container,Center,Stack,Paper, Button, TextInput,Textarea, Group,Box} from '@mantine/core';
import { IconCopy, IconCheck, IconWorldMinus } from '@tabler/icons-react';
import { ActionIcon, CopyButton, Tooltip, Table, Badge } from '@mantine/core';
import {QRCodeSVG} from 'qrcode.react';
import {MercuryContext,NotificationContext } from '../../lib/runtime';

export default function SettingsReplicatorTab() {
  const {mercury} = useContext(MercuryContext);
  const [name,setName] = useState('');
  const [channel,setChannel] = useState('');
  const [replicators,setReplicators] = useState([]);
  const notification = useContext(NotificationContext);

  // When a new peer connected to the user topic
  mercury.network.on('update', () => fetchReplicators());

  const fetchReplicators = ()=>{
    mercury.db.getAllRepositories()
      .then((lisst)=>setReplicators(lisst));
  };

  useEffect(()=>{
    fetchReplicators();
  },[]);

  const removeReplicator = (r)=>{
    mercury.removeRepository(r.id)
      .then(()=>{
        notification.createSuccess(`Repository ${r.name} has been removed`);
        fetchReplicators();
      })
      .catch((err)=>notification.createError(`Can't remove repository ${String(err)}`));

  };
  const addRepo = ()=>{
    mercury.joinRemoteRepository(channel,name)
      .then(()=>{
        notification.createSuccess(`${name} has beed appended as Repository`);
        setName('');
        setChannel('');
        fetchReplicators();
      })
      .catch((err)=>notification.createError(`${String(err)}`,'Failed to append repository'));
  };

  const rowsReplicator = replicators.map((e)=>{
    const isOnline = mercury.network.peers.has(e.peer);
    const publicKey = `${String(e.peer).slice(0,5)} ... ${String(e.peer).slice(-6)}`;
        return html`
            <${Table.Tr} key=${e.id}>
                <${Table.Td}>${e.name}<//>
                <${Table.Td}>${publicKey}<//>
                <${Table.Td}><${Badge} color=${isOnline?"green":"red"}>${isOnline?"Online":"Offline"}<//><//>
                <${Table.Td}>
                    <${ActionIcon} onClick=${()=>removeReplicator(e)} variant="light" color="red" aria-label="Remove">
                        <${IconWorldMinus}/>
                    <//>
                <//>
            <//>
        `;});

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
          <${Table.Tbody}>${rowsReplicator}</${Table.Tbody}>
        </${Table}>
      </${Box}>
      </${Stack}>
    </${Center}>
  </${Container}>
    `;
};
