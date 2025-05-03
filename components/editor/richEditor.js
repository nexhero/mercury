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
    const {createSuccess} = useContext(NotificationContext);
    const {tags} = useContext(MercuryContext);
    const [label,setLabel] = useState('');
    const [tag,setTag] = useState('');
    const timeRef = useRef(null);
    const delay_time = 3000;

    const resetTimeRef = ()=>{
        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }
        timeRef.current = setTimeout(()=>{
            save();
            createSuccess('Document saved','Autosaving');
        },delay_time);
        return ()=>{
            clearTimeout(timeRef.current);
            timeRef.current = null;
        };
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
            // save();
            resetTimeRef();
        }
    });

    const save = async() => {
        if (editor) {
            document.setLabel(label);
            document.setTag(tag);
            document.setContent(editor.getHTML());
            console.log(`Saving document ${document.toJson()}`);
            document.save();
        }
    };

    useEffect(()=>{
        setTag(document.tag);
        setLabel(document.label);
        editor.commands.setContent(document.content);
    },[]);

    useEffect(()=>{
        resetTimeRef();
    },[label,tag]);
    return html`
<${Box} p="md">
  <${Group}>
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
        value=${tag}
        onChange=${setTag}
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
