import React, { useEffect, useState} from 'react'
import {html} from 'htm/react';
import {Container,Center,Stack,Paper, Button, TextInput, Group,Box} from '@mantine/core'
import { IconCopy, IconCheck, IconWorldMinus } from '@tabler/icons-react';
import { ActionIcon, CopyButton, Tooltip, Table } from '@mantine/core';

import {useRepository} from '../../../lib/core'

// const replicators = [
//     {id:'01',name:'android lg',publickey:"0b7e2b9ee1071dafec0137c537d4062d9f61fc465878e136ae0065cfbb77b8d0"},
//     {id:'02',name:'desktop linux',publickey:"1b7e2b9ee1071dafec0137c537d4062d9f61fc465878e136ae0065cfbb77b8d0"},
//     {id:'03',name:'server',publickey:"2b7e2b9ee1071dafec0137c537d4062d9f61fc465878e136ae0065cfbb77b8d0"},
//     {id:'04',name:'desktop arch',publickey:"3b7e2b9ee1071dafec0137c537d4062d9f61fc465878e136ae0065cfbb77b8d0"}
// ]

export default function ReplicatorTab(){
    const repoFn = useRepository()
    const [name,setName] = useState('')
    const [channel,setChannel] = useState('')
    const [replicators,setReplicators] = useState([])
    const addRep = ()=>{
        repoFn.addReplicator(channel,name).then(()=>{
            repoFn.allChannels().then((result)=>setReplicators(result))
        })
    }
    const removeReplicator = (data)=>{
        console.log('removing:',data)
    }

    const rowsReplicator = replicators.map((e)=>html`
            <${Table.Tr} key=${e.id}>
                <${Table.Td}>${e.name}<//>
                <${Table.Td}>${e.publickey}<//>
                <${Table.Td}>
                    <${ActionIcon} onClick=${()=>removeReplicator(e)} variant="light" color="red" aria-label="Remove">
                        <${IconWorldMinus}/>
                    <//>
                <//>
            <//>
        `)
    useEffect(()=>{
        repoFn.allChannels().then((result)=>setReplicators(result))
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
                            <${Table.Th}>Publickey<//>
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
