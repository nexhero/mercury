// TODO: navbar title doesn't make sense
// FIXME: Large document files looks awful
// TODO: Implement search fzf

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
import MiniSearch from 'minisearch';
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
  const {documents,documentsTree, createDocument, openDocument,duplicateDocument,deleteDocument,deleteDocumentByTag} = useContext(MercuryContext);
  // const {documents, createDocument, openDocument,duplicateDocument,deleteDocument,deleteDocumentByTag} = useContext(MercuryContext);
  // const documentsTree = []
  const tree = useTree();
  const { showContextMenu } = useContextMenu();
  const confirmDialog = useDisclosure(false);
  const [dialogMessage,setDialogMessage] = useState('');
  const tagRef = useRef(null);

  const fuse = useRef(new MiniSearch({
    fields:['label','content','tag'],
    storeFields:[
      'label',
      'value',
      'content',
      'id',
      'tag',
      'created_at',
      'updated_at',
      'type'
    ]
  }));
  const [search,setSearch] = useState('');
  const [seek,setSeek] = useState(null); //seek for documetns

  const clearSearch = ()=>{
    setSearch('');
    setSeek(null);
  };
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
      if (node.type !== 'TAG' && node.value) {
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

  const prepareFuse = ()=>{
    if (fuse.current.termCount) {
      fuse.current.removeAll();
      fuse.current.addAll(documents);
    }else{
      fuse.current.addAll(documents);
    }

  };
  useEffect(()=>{
    if (documents.length) {

      prepareFuse();
    }
  },[documents]);
  useEffect(()=>{
    console.log('Trigged')
    if (search.length) {
      const result = fuse.current.search(search,{ prefix: true });

      // console.log(`total result ${result.length}`);
      // console.log('tree');
      // console.log(documentsTree);
      setSeek(result);
    }else{
      setSeek(null);
    }

  },[search]);
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
          value=${search}
          onChange=${(e)=>setSearch(e.currentTarget.value)}
          placeholder="Search"
          />
          <${ActionIcon}
            onClick=${clearSearch}
            variant="light"
            color="gray"
            aria-label="Clear">
            <${IconSquareLetterX}/>
          </${ActionIcon}>
        </${Group}>
      </${Stack}>
    </${Box}>
    <${Divider}/>
    <${Tree} data=${seek?seek:documentsTree}
             tree=${tree}
             levelOffset=${18}
             renderNode=${(payload)=>html`<${Leaf} ...${payload} />`}
      />

  </${Stack}>
  `;
}
