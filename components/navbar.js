// TODO: navbar title doesn't make sense
import React,{useContext,useEffect} from 'react';
import {html} from 'htm/react';
import {Stack, Flex, Title, Divider,Tree,useTree, Group,Box, ActionIcon, Modal} from '@mantine/core';
import {IconTag, IconNote} from '@tabler/icons-react';
import {
  IconChevronDown,
  IconCopy,
  IconWriting,
  IconTrash,
  IconFileFilled

} from '@tabler/icons-react';
import { useContextMenu } from 'mantine-contextmenu';
import {MercuryContext} from '../lib/runtime/index.js';

export function DocumentIcon({node,expanded}){
  if (node.type ==='tag') {
    return html`
<${IconChevronDown}
  size=${24}
  style=${{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
  />
`;
  }else{
    return html`<${IconFileFilled} size=${24}/>`;
  }

}


export default function Navbar(){
  const {documents, createDocument, openDocument,duplicateDocument} = useContext(MercuryContext);
  const tree = useTree();
  const { showContextMenu } = useContextMenu();
  const handleDuplicate=(node)=>{
    duplicateDocument(node);
  };
  const handleDelete = (node)=>{
    console.log('handle deletion for document');
  };
const Leaf = ({node, expanded, hasChildren, elementProps}) => {
  const handleOpenDocument = () => {
    if (node.type !== 'tag' && node.value) {
      console.log('Opening doc:', node);
      openDocument(node);
    }
  };

  return html`
    <${Group} preventGrowOverflow=${false} gap=${5} ...${elementProps}>
      <${Box}
        onClick=${handleOpenDocument}
               onContextMenu=${showContextMenu([
        {
          key:'duplicate',
          icon: html`<${IconCopy} size=${16} />`,
          title:'Duplicate',
          onClick:()=>handleDuplicate(node)
        },
        {
          key:'delete',
          color: '#ff00ff',
          icon: html`<${IconTrash} size=${16} />`,
          title:'Delete',
          onClick:()=>handleDelete(node)
        }
        ])}
        >
        <span>
          <${DocumentIcon} node=${node} expanded=${expanded} />
          ${node.label}
        </span>
      </${Box}>
    </${Group}>
  `;
};

  return html`
<${Stack}>
  <${Flex} gap="sm" justify="flex-end">
    <${Box}>
      <${ActionIcon} onClick=${createDocument} variant="light" color="gray" aria-label="Note"><${IconNote}/></${ActionIcon}>
    </${Box}>
  </${Flex}>
  <${Title} order=${5}>Documents</${Title}>
  <${Divider}/>
  <${Tree} data=${documents}
           tree=${tree}
           levelOffset=${18}
           renderNode=${(payload)=>html`<${Leaf} ...${payload} />`}
      />

  </${Stack}>
  `;
}
