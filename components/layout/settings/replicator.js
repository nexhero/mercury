import React, { useContext, useEffect, useState} from 'react'
import {html} from 'htm/react';
import {Container,Center,Stack,Paper, Button, TextInput, Group,Box} from '@mantine/core'
import { IconCopy, IconCheck, IconWorldMinus } from '@tabler/icons-react';
import { ActionIcon, CopyButton, Tooltip, Table, Badge } from '@mantine/core';

import {Mercury} from '../../../lib/runtime'
export default function ReplicatorTab(){
    const {swarm} = Mercury.swarm()
    const noti = Mercury.noti()
    const repoFn = useRepository()
    const notiFn = useContext(NotificationContext)
    const [name,setName] = useState('')
    const [channel,setChannel] = useState('')
    const [replicators,setReplicators] = useState([])

    swarm.on('appended',(peer)=>{
            fetchRepo()
        })

    const addRep = ()=>{
        swarm.addRepository(channel,name)
             .then((msg)=>{
                 noti.createSuccess(msg)
                 swarm.allRepositories().then((r)=>setReplicators(r))
             })
             .catch((err)=>noti.createError(err))
    }
    const removeReplicator = (data)=>{
        swarm.removeRepository(data.id)
             .then((msg)=>noti.createSuccess(`Repository ${data.name} has been removed`))
             .catch((err)=>noti.createError('Repository not found','Unable to remove repository'))
        fetchRepo()
    }

    const rowsReplicator = replicators.map((e)=>html`
            <${Table.Tr} key=${e.id}>
                <${Table.Td}>${e.name}<//>
                <${Table.Td}>${e.peer}<//>
                <${Table.Td}><${Badge} color=${swarm.network.peers.has(e.peer)?"green":"red"}>${swarm.network.peers.has(e.peer)?"Online":"Offline"}<//><//>
                <${Table.Td}>
                    <${ActionIcon} onClick=${()=>removeReplicator(e)} variant="light" color="red" aria-label="Remove">
                        <${IconWorldMinus}/>
                    <//>
                <//>
            <//>
        `)

    const fetchRepo = ()=>{
        swarm.allRepositories().then((r)=>{
            setReplicators(r)
        })
    }
    useEffect(()=>{
        fetchRepo()
    },[])

     return(
        html`
        <${Container}pt="12">
        <${Center}>
        <${Stack}>
              <${Group}>
                <${TextInput} w="40vw" description="Local Repository key" disabled value=${swarm.repository?swarm.repository:''}/>
                <${CopyButton} value=${swarm.repository}>
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
