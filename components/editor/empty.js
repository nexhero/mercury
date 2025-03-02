import {html} from 'htm/react'
import { Center, Box, Image } from '@mantine/core';


export default function EmptyEditor(){
  return(
    html`
<${Box}>

      <${Center}>
        <h1>Create a new note Ctrl+N 😀</h1>
<//>
<//>
    `
  )
}
