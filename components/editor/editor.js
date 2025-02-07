import { html } from "htm/react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import { RichTextEditor } from "@mantine/tiptap";
import {
  IconBold,
  IconItalic,
  IconUnderline,
  IconHighlight,
  IconStrikethrough,
  IconCode,
  IconClearFormatting
} from "@tabler/icons-react";
import { TextInput, Box, Stack, Button, Group, Autocomplete, ScrollArea } from "@mantine/core";
import { useState,useEffect } from "react";
import { listTagAtom, useNote } from "../../lib/core";
import { useAtomValue,useSetAtom } from 'jotai'
import {activeNoteAtom} from '../../lib/core'
import {useNotificationFn} from '../../lib/notification'
export default function Editor() {
  const notiFn = useNotificationFn()
  const activeNote = useAtomValue(activeNoteAtom)
  const listTag = useAtomValue(listTagAtom)
  const [tag,setTag] = useState(activeNote.tag)
  const [label,setLabel] = useState(activeNote.label)
  const notesFn = useNote()
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content: activeNote.content,

  });

  const save = () => {
    if (editor) {
      activeNote.setLabel(label)
      activeNote.setTag(tag)
      activeNote.setContent(editor.getHTML())
      notesFn.save(activeNote.toJson()).then((msg)=>{
        notiFn.createSuccess(msg)
      }).catch((err)=>{
        notiFn.createError(err)
      })
    }
  };
  useEffect(()=>{
    setTag(activeNote.tag)
    setLabel(activeNote.label)
    editor.commands.setContent(activeNote.content)
  },[activeNote])
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
          <${RichTextEditor.Toolbar} sticky stickyOffset=${60}>
            <${RichTextEditor.ControlsGroup}>
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
      <${Group} position="right" mt="md">
        <${Button} onClick=${save} variant="filled" color="cyan">
          Save
        </${Button}>
      </${Group}>
    </${Box}>
  `;
}
