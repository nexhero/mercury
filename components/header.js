import React from 'react'
import {html} from 'htm/react'
import {Flex,Group,Title,Burger} from '@mantine/core'

export default function Header({toggle,opened}){
  return html`
<${Group}>
  <${Burger} opened=${opened} onClick=${toggle} hiddenFrom="sm" size="sm" />
  <${Title} order=${5}>Mercury</${Title}>
  <${Group} style=${{flex:'auto'}} mx="auto" justify="flex-end"><pear-ctrl></pear-ctrl><//>
</${Group}>
  `
}
