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
            onChange?.(e.detail.unicode);
            console.log('Emoji:',e);
        });
    },[]);
    return html `
        <emoji-picker ref=${ref}></emoji-picker>
    `;
};

export function IconEmojiPicker({value=null,onChange=null, ...props}){
    const [emoji,setEmoji] = useState(value?value:'🦕');
    const [opened,setOpened] = useState(false);

    const handleChange = (v)=>{
        if (onChange) {
            onChange(v);
        }
        setEmoji(v);
    }
    return html`
<${Popover} opened=${opened} onChange=${setOpened}>
  <${Popover.Target}>
    <${Button} onClick=${()=>setOpened((visible)=>!visible)}>
      ${emoji}
    </${Button}>
  </${Popover.Target}>
  <${Popover.Dropdown}>
    <${EmojiPicker} onChange=${handleChange}/>
  </${Popover.Dropdown}>
</${Popover}>
    `;
}
