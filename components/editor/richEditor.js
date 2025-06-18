/*#+ORG
* Todo List
** TODO When label changes, there is no update in the tap name
** [ ] Implement a system to append other documents
** [ ] There is a bug in the 'Task List' markdown format, cursor become invisible
** IDEA Let user add emojis as icons for documents
[[https://www.npmjs.com/package/emoji-picker-react][package]]
** IDEA User can choose between Markdown and Org mode
** TODO Document on save, do not change tag

#+END_ORG*/

import { html } from "htm/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import { IconColorPicker } from '@tabler/icons-react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image';
import { useEditor } from "@tiptap/react";
import {
    RichTextEditor,
    getTaskListExtension
} from "@mantine/tiptap";
import {
    IconBold,
    IconItalic,
    IconUnderline,
    IconHighlight,
    IconStrikethrough,
    IconCode,
    IconClearFormatting,
    IconListDetails
} from "@tabler/icons-react";
import { TextInput, Box, Stack, Button, Group, Autocomplete, ScrollArea } from "@mantine/core";
import React,{ useState, useEffect, useContext, useRef } from "react";
import {MercuryContext} from '../../lib/runtime';
import {NotificationContext} from '../../lib/runtime/notification';
import {IconEmojiPicker,renderAutocompleteOpt} from '../index';
const textColor =[
    '#5d275d',
    '#b13e53',
    '#ef7d57',
    '#ffcd75',
    '#a7f070',
    '#38b764',
    '#41a6f6',
    '#73eff7',
    '#94b0c2',
];
export default function RichEditor({document}){
    const notification = useContext(NotificationContext);
    const {tags,activeDoc} = useContext(MercuryContext);
    const [label,setLabel] = useState(document.label);
    const [tag,setTag] = useState(document.tag);
    const [icon,setIcon] = useState(document.icon);
    ////////////////////////////////////////
    // Autosaving: Once user stop typing, //
    // after delay_time trigger save()    //
    ////////////////////////////////////////
    const timeRef = useRef(null);
    const delay_time = 1000;

    const resetTimeRef = ()=>{
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }
        timeRef.current = setTimeout(()=>{
            save();

        },delay_time);
        return ()=>{
            clearTimeout(timeRef.current);
            timeRef.current = null;
        };
    };
    const save = async() => {
        document.setLabel(label);
        document.setTag(tag);
        document.setContent(editor.getHTML());
        document.setIcon(icon);
        document.save()
            .catch((err)=>notification(`${String(err)}`,'Unable to autosave document'));

    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Highlight,
            TextStyle,
            Color,
            getTaskListExtension(TipTapTaskList),
            TaskItem.configure({
                nested: true,
                HTMLAttributes: {
                    class: 'test-item',
                },
            }),
            Image.configure({
                allowBase64: true,
            })
        ],
        content: document.content,
        onUpdate:({editor})=>{
            resetTimeRef();
        }
    });


    useEffect(()=>{
        setTag(document.tag);
        setLabel(document.label);
        setIcon(document.icon)
        editor.commands.setContent(document.content);
    },[]);

    useEffect(()=>{
        resetTimeRef();
    },[label,tag]);

    const renderAuto = ({option})=>{
        return html`
<${renderAutocompleteOpt} option=${option} setTag=${setTag}/>

`    }

    //////////////////////////
    // render only on focus //
    //////////////////////////
    if (activeDoc !== document.id) {
        return html`<div>runnig background</div>`
    }

    return html`
<${Box} p="md">
  <${Group} justify="space-between" wrap="nowrap" preventGrowOverflow={false} align="center">
    <div>
      <${IconEmojiPicker}
        value=${icon}
        onChange=${setIcon}
        />
    </div>
    <${Box} w="80%">
      <${TextInput}
        value=${label}
        onChange=${(e)=>setLabel(e.currentTarget.value)}
        size="lg"
        radius="xs"
        placeholder="Title" />
      </${Group}>
      <${Autocomplete}
        data=${tags}
        renderOption=${renderAuto}
        size="lg"
        radius="xs"
        placeholder="Tag"

        />
    </${Group}>

    <${Stack} spacing="md" mt="md">
      <${RichTextEditor}
        editor=${editor}
        variant="subtle"
        styles=${{
        root: { backgroundColor: "transparent" },
        content: { backgroundColor: "transparent", border: "none" },
        }}
        >
        <${RichTextEditor.Toolbar} sticky>
          <${RichTextEditor.ControlsGroup}>
            <${RichTextEditor.TaskList}/>
            <${RichTextEditor.TaskListLift} />
            <${RichTextEditor.TaskListSink} />
            <${RichTextEditor.ColorPicker}
              colors=${textColor}/>
            <${RichTextEditor.Bold} icon=${IconBold}/>
            <${RichTextEditor.Italic} icon=${IconItalic}/>
            <${RichTextEditor.Underline} icon=${IconUnderline} />
            <${RichTextEditor.Strikethrough} icon=${IconStrikethrough} />
            <${RichTextEditor.ClearFormatting} icon=${IconClearFormatting} />
            <${RichTextEditor.Highlight} icon=${IconHighlight} />
            <${RichTextEditor.Code} icon=${IconCode} />
          </${RichTextEditor.ControlsGroup}>
        </${RichTextEditor.Toolbar}>
        <${ScrollArea} h="70vh">
          <${RichTextEditor.Content} />
        </${ScrollArea}>
      </${RichTextEditor}>
    </${Stack}>
  </${Box}>
    `;

}
