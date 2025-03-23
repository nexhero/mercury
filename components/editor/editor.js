import { html } from "htm/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import TaskItem from '@tiptap/extension-task-item';
import TipTapTaskList from '@tiptap/extension-task-list';
import { IconColorPicker } from '@tabler/icons-react';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Image from '@tiptap/extension-image'
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
import { useState, useEffect, useContext } from "react";
import { listTagAtom, useNote } from "../../lib/core";
import { useAtomValue } from 'jotai'

import { Mercury } from '../../lib/runtime'

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
]
export default function Editor({activeNote}) {
  const notiFn = Mercury.noti()

  const listTag = useAtomValue(listTagAtom)
  const [tag,setTag] = useState(activeNote.tag)
  const [label,setLabel] = useState(activeNote.label)
  // const notesFn = Mercury.hyper()
  const notesFn = useNote()
  //TODO: Implement Image Uploading
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
    content: activeNote.content,
    onUpdate:({editor})=>{
      save()
    }
  });

  const save = async() => {
    console.log(activeNote)
    if (editor) {
      activeNote.setLabel(label)
      activeNote.setTag(tag)
      activeNote.setContent(editor.getHTML())
      activeNote.save()
    }
  };
  useEffect(()=>{
    setTag(activeNote.tag)
    setLabel(activeNote.label)
    editor.commands.setContent(activeNote.content)
  },[activeNote])

  useEffect(()=>{
    save()
  },[tag,label])

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
        <//>
        <${Autocomplete}
          data=${listTag}
          value=${tag}
          onChange=${setTag}
          size="lg"
          radius="xs"
          placeholder="Tag"

        />
        <${Button} onClick=${save}>Save<//>
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
