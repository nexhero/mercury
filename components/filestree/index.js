import React,{} from 'react'
import {html} from 'htm/react'
import {useAtomValue} from 'jotai'
import {notesAtom} from '../../lib/core'
import {Container,Group,Box, Flex, Tree, ColorSwatch,Stack,rem, } from '@mantine/core'
import { useTree } from '@mantine/core';
import TreeHeader from './treeActions'
import {useTag} from '../../lib/core'
export default function FilesystemTree(){
  const tag = useTag()
  const listNotes = useAtomValue(notesAtom)
  const tree = useTree();
  const onClickEvent = (node,expanded)=>{
    expanded?tree.collapse(node.value):tree.expand(node.value)
    tag.setActiveTag(node.value)
  }

  return(
    html`

    <${Stack}>
      <${Flex} gap="sm" justify="flex-end">
        <${TreeHeader}/>
      </${Flex}>
      <${Tree} data=${listNotes}
        tree=${tree}
        levelOffset=${18}
        renderNode=${({node,expanded, hasChildren, elementProps})=>(
          html`
          <${Group} ...${elementProps} onClick=${()=>onClickEvent(node,expanded)} >
              ${(node.type=="tag" && hasChildren) &&(
                html`<${ColorSwatch} color=${node.color} size=${rem(12)} />`
            )}
            <${Box} style=${{color:node.color}}>${node.label}</${Box}>
          </${Group}>`
        )}
      />
    </${Stack}>

    `
  )
}
