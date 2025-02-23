import React, { useContext, useEffect, useState} from 'react'
import {html} from 'htm/react';
import {Container,Center,Stack,Paper, Button, TextInput, Group,Box} from '@mantine/core'
import { IconCopy, IconCheck, IconWorldMinus } from '@tabler/icons-react';
import { ActionIcon, CopyButton, Tooltip, Table, Badge } from '@mantine/core';

import {useRepository} from '../../../lib/core'
import { NotificationContext } from '../../../lib/notification';

export default function ReplicatorTab(){

    const repoFn = useRepository()
    const notiFn = useContext(NotificationContext)
    const [name,setName] = useState('')
    const [channel,setChannel] = useState('')
    const [replicators,setReplicators] = useState([])
    const addRep = ()=>{
        repoFn.addReplicator(channel,name).then(()=>{
            repoFn.allChannels()
                  .then((result)=>setReplicators(result))
        }).catch((err)=>notiFn.createError('Unable to add channel'))
    }
    const removeReplicator = (data)=>{

        repoFn.removeChannel(data.id)
              .then((msg)=>{
                  notiFn.createSuccess(msg)
                  repoFn.allChannels()
                        .then((result)=>setReplicators(result))
              }).catch((err)=>notiFn.createError(`${err}`,'Unable to remove channel'))
    }

    const rowsReplicator = replicators.map((e)=>html`
            <${Table.Tr} key=${e.id}>
                <${Table.Td}>${e.name}<//>
                <${Table.Td}>${e.peer}<//>
                <${Table.Td}><${Badge} color=${e.status?"green":"red"}>${e.status?"Online":"Offline"}<//><//>
                <${Table.Td}>
                    <${ActionIcon} onClick=${()=>removeReplicator(e)} variant="light" color="red" aria-label="Remove">
                        <${IconWorldMinus}/>
                    <//>
                <//>
            <//>
        `)
    useEffect(()=>{
        const selfUpdate = setInterval(()=>{
            repoFn.allChannels()
              .then((result)=>setReplicators(result))
              .catch((err)=>notiFn.createError('Unable to retrieve channels information'))
        },5000)
        repoFn.allChannels()
              .then((result)=>setReplicators(result))
              .catch((err)=>notiFn.createError('Unable to retrieve channels information'))
        return () => clearInterval(selfUpdate);
    },[])

    return(
        html`
        <${Container}pt="12">
        <${Center}>
        <${Stack}>
              <${Group}>
                <${TextInput} w="40vw" description="Local Repository key" disabled value=${repoFn.publicKey?repoFn.publicKey:''}/>
                <${CopyButton} value=${repoFn.publicKey}>
                    ${({ copied, copy }) => html`
            <${Tooltip} label=${copied ? 'Copied' : 'Copy'} withArrow position="right">
            <${ActionIcon} color=${copied ? 'teal' : 'gray'} variant="subtle" onClick=${copy}>
            ${copied ? html`<${IconCheck} size=${16} />` : html`<${IconCopy} size=${16} />`}
        <//>
        <//>
        `}
                <//>
            <//>
            <${Group}>
                <${TextInput} value=${name} onChange=${(e)=>setName(e.target.value)} w="30vw" placeholder="Name Channel"/>
                <${TextInput} value=${channel} onChange=${(e)=>setChannel(e.target.value)} w="30vw" placeholder="Remote Channel"/>
                <${Button} onClick=${addRep} variant="filled">Add<//>
            <//>
            <${Box}>
                <${Table}>
                    <${Table.Thead}>
                        <${Table.Tr}>
                            <${Table.Th}>Name<//>
                            <${Table.Th}>Peer<//>
                            <${Table.Th}>Status<//>
                        <//>
                    <//>
                    <${Table.Tbody}>${rowsReplicator}<//>
                <//>
            <//>
        <//>
        <//>
        <//>
    `
    )
}
