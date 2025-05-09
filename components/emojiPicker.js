import React,{useState,useEffect,useRef} from 'react';
import {html} from 'htm/react';

import {Button, Popover} from '@mantine/core';
import 'emoji-picker-element';

export default function EmojiPicker({onChange,...props}) {

    const ref = useRef(null);
    const eventChange = ()=>{

    };
    useEffect(()=>{
        ref.current.locale= 'en';
        ref.current.dataSource = './assets/emojis/data.json';
        ref.current.addEventListener('emoji-click',e=>{
            onChange?.(e.detail);
            console.log('Emoji:',e);
        });
    },[]);
    return html `
        <emoji-picker ref=${ref}></emoji-picker>
    `;
};

export function IconEmojiPicker({onChange, ...props}){
    const [emoji,setEmoji] = useState('🙂');
    const [opened,setOpened] = useState(false);

    return html`
<${Popover} opened=${opened} onChange=${setOpened}>
  <${Popover.Target}>
    <${Button} onClick=${()=>setOpened((visible)=>!visible)}>
      ${emoji.unicode}
    </${Button}>
  </${Popover.Target}>
  <${Popover.Dropdown}>
    <${EmojiPicker} onChange=${setEmoji}/>
  </${Popover.Dropdown}>
</${Popover}>
    `;
}
