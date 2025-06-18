
/*#+ORG
* TODO navbar title doesn't make sense
* TODO Large document files looks awful
* TODO Minisearch can't find in content due to html, it needs a parser

#+END_ORG*/
import React,{useState,useContext,useEffect,useRef} from 'react';
import {html} from 'htm/react';
import {Text,TextInput,Button,Stack, Flex, Title, Divider,Tree,useTree, Group,Box, ActionIcon, Modal, ScrollArea} from '@mantine/core';
import {
  IconChevronDown,
  IconCopy,
  IconWriting,
  IconTrash,
  IconFileFilled,
  IconSquareLetterX,
  IconEdit
} from '@tabler/icons-react';
import MiniSearch from 'minisearch';
import { useContextMenu } from 'mantine-contextmenu';
import {useDisclosure} from '@mantine/hooks';
import {MercuryContext} from '../lib/runtime/index.js';
import NavbarActions from './navbarActions';
import {TagFormContext} from './dialogs/';
export function DocumentIcon({node,expanded}){
  if (node.type ==='TAG') {
    return html`
<${Group}>
  <${IconChevronDown}
    size=${24}
    style=${{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
    />
  ${node.icon}
</${Group}>
`;
  }else{
    // return html`<${IconFileFilled} size=${24}/>`;
    return html`<${Box}>${node.icon}</${Box}>`
  }

}


export default function Navbar(){
  const {documents,documentsTree, createDocument, openDocument,duplicateDocument,deleteDocument,deleteDocumentByTag} = useContext(MercuryContext);
  // const {documents, createDocument, openDocument,duplicateDocument,deleteDocument,deleteDocumentByTag} = useContext(MercuryContext);
  const {openTagForm} = useContext(TagFormContext)
  const tree = useTree();
  const { showContextMenu } = useContextMenu();
  const confirmDialog = useDisclosure(false);
  const [dialogMessage,setDialogMessage] = useState('');
  const tagRef = useRef(null);

  const fuse = useRef(new MiniSearch({
    fields:['label','content','tag'],
    storeFields:[
      'icon',
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
        openDocument(node);
      }
    };

    const handleEditDocument = ()=>{
      openDocument(node);
      if (node.type === 'TAG') {
        openTagForm();
      }
    }
    return html`
<${Group} preventGrowOverflow=${false} gap=${5} ...${elementProps}>
  <${Box}
    onClick=${handleOpenDocument}
    onContextMenu=${showContextMenu([
    {
          key:'edit',
          icon: html`<${IconEdit} size=${16} />`,
          title:'Edit',
          onClick:()=>handleEditDocument()
        },
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
        <${Group}>
          <${Box}>${node.icon} ${node.label}</${Box}>

        </${Group}>
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
    if (search.length) {
      const result = fuse.current.search(search,{ prefix: true });
      // console.log(`total result ${result.length}`);
      // console.log('tree');
      // console.log(documentsTree);
      console.log(result)
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
    <${ScrollArea} w=${200}>
    <${Tree} data=${seek?seek:documentsTree}
             tree=${tree}
             levelOffset=${18}
             renderNode=${(payload)=>html`<${Leaf} ...${payload} />`}
                      />
                                          </${ScrollArea}>
                                          </${Stack}>

  `;

}
