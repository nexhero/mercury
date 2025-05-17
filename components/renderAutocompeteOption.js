import React from 'react';
import { html } from "htm/react";
import { Group, Text, Box } from "@mantine/core";
export default function renderAutocompleteOpt({setTag,option,...props}){
    const handleClick = ()=>{
        setTag(option.value)
    }
    return html`
<${Group} gap="sm" onClick=${handleClick}>
<${Text} >${option.icon} ${option.label}</${Text}>

</${Group}>
`
}
