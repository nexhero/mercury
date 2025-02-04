import React, { useEffect, useState } from 'react'
import {html} from 'htm/react'
import {useAtomValue} from 'jotai'
import { notesAtom, useNote,filetreeAtom } from '../../lib/core'
import {Container,Group,Box, Flex, Tree, ColorSwatch,Stack,rem,Menu } from '@mantine/core'
import { useTree } from '@mantine/core';
import {
  IconChevronDown,
  IconCopy,
  IconWriting,
  IconTrash,
} from '@tabler/icons-react';
import TreeHeader from './treeActions'
// import { useQuery } from '@tanstack/react-query'
// import {useYouse} from '../../lib/youse'
import { useContextMenu } from 'mantine-contextmenu';

export default function FilesystemTree(){
  const listNotes = useAtomValue(filetreeAtom)
  const notes = useNote()
  const tree = useTree()
  const { showContextMenu } = useContextMenu();


  return(
    html`

    <${Stack}>
      <${Flex} gap="sm" justify="flex-end">
        <${TreeHeader}/>
      </${Flex}>
      <${Tree} data=${listNotes}
        tree=${tree}
        levelOffset=${18}
        renderNode=${({ node, expanded, hasChildren, elementProps }) => html`
        <${Group} gap=${5} ...${elementProps}>
          ${hasChildren && html`
            <${IconChevronDown}
              size=${18}
              style=${{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          `}
        <${Box} onContextMenu=${showContextMenu([
          {
            key:'duplicate',
            icon: html`<${IconCopy} size=${16} />`,
            title:'Duplicate',
            onClick:()=>console.log('Duplicate note:'+node.value)
          },
          {
            key:'rename',
            icon: html`<${IconWriting} size=${16} />`,
            title:'rename',
            onClick:()=>console.log('Rename note:'+node.value)
          },
          { key: 'divider' },

          {
            key:'delete',
            color: '#ff00ff',
            icon: html`<${IconTrash} size=${16} />`,
            title:'Delete',
            onClick:()=>console.log('Delete note:'+node.value)
          }
        ])}
          onClick=${()=>notes.openNote(node.value)}>${node.label}</span>
        <//>
      `}
      />
    </${Stack}>

    `
  )
}
