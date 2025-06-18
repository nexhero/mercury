import React from 'react';
import { html } from "htm/react";
import { Group, Text, Box } from "@mantine/core";
export default function renderAutocompleteOpt({setTag,option,...props}){
    const handleClick = ()=>{
        console.log(option)
        setTag(option.value)
    }
    return html`
<${Group} gap="sm" onClick=${handleClick} style=${{ width:'100%'}}>
<${Text} >${option.icon} ${option.label}</${Text}>

</${Group}>
`
}
