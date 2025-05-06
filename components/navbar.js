// TODO: navbar title doesn't make sense
import React,{useState,useContext,useEffect,useRef} from 'react';
import {html} from 'htm/react';
import {Text,TextInput,Button,Stack, Flex, Title, Divider,Tree,useTree, Group,Box, ActionIcon, Modal} from '@mantine/core';
import {
  IconChevronDown,
  IconCopy,
  IconWriting,
  IconTrash,
  IconFileFilled,
  IconSquareLetterX
} from '@tabler/icons-react';
import { useContextMenu } from 'mantine-contextmenu';
import {useDisclosure} from '@mantine/hooks';
import {MercuryContext} from '../lib/runtime/index.js';
import NavbarActions from './navbarActions';
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
  const {documents, createDocument, openDocument,duplicateDocument,deleteDocument,deleteDocumentByTag} = useContext(MercuryContext);
  const tree = useTree();
  const { showContextMenu } = useContextMenu();
  const confirmDialog = useDisclosure(false);
  const [dialogMessage,setDialogMessage] = useState('');
  const tagRef = useRef(null);
  const handleDuplicate=(node)=>{
    duplicateDocument(node);
  };

  const handleDelete = (node)=>{
    if (node.type !== 'tag') {
      deleteDocument(node);
    }else{
      tagRef.current = node;
      setDialogMessage(`By removing the "${node.label}" tag, you are also deleting all associated notes.`);
      confirmDialog[1].open();
    }
  };
  const confirmDeleteTag = ()=>{
    console.log(`removing tag ${tagRef.current.label}`);
    deleteDocumentByTag(tagRef.current.label);
    confirmDialog[1].close();

    tagRef.current = null;
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
  <${Modal} opened=${confirmDialog[0]} onClose=${confirmDialog[1].close}>
    <${Text}>${dialogMessage}</${Text}>
    <${Group} justify="flex-end">
      <${Button} onClick=${confirmDialog[1].close}>Cancel</${Button}>
      <${Button} onClick=${()=>confirmDeleteTag()}>Accept</${Button}>
    </${Group}>
  </${Modal}>
  <${Flex} gap="sm" justify="flex-end">
    <${NavbarActions}/>

  </${Flex}>
  <${Box} w="100%" align="center">
    <${Stack}>
      <${Title} order=${5}>Documents</${Title}>
      <${Group} grow wrap="nowrap" preventGrowOverflow=${false} gap="xs">
        <${TextInput}
        placeholder="Search"
        />
        <${ActionIcon}
          onClick=${()=>console.log('Clear search')}
          variant="light"
          color="gray"
          aria-label="Clear">
          <${IconSquareLetterX}/>
        </${ActionIcon}>
      </${Group}>
    </${Stack}>
  </${Box}>
  <${Divider}/>
  <${Tree} data=${documents}
           tree=${tree}
           levelOffset=${18}
           renderNode=${(payload)=>html`<${Leaf} ...${payload} />`}
      />

  </${Stack}>
  `;
}
