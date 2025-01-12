import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { RichTextEditor } from '@mantine/tiptap';
import { html } from 'htm/react';
import { IconBold, IconItalic } from '@tabler/icons-react';
import {TextInput,Box, Stack,Button,Group} from '@mantine/core'
const content = '<p>Subtle rich text editor variant</p>';
const BoldIcon = () => html`<${IconBold} size="1rem" stroke=${3.5} />`

export default function NoteEditor() {
  const editor = useEditor({
    extensions: [StarterKit, Underline, Highlight],
    content,
  });
  const save = ()=>{
    console.log(editor)
  }
  return (
    html`
    <${Box}>
      <${Stack}>
        <${Group} >
          <${TextInput}
            size="lg"
            radius="xs"
            placeholder="Title"

          />
          <${Button} onClick=${save} variant="filled" color="cyan">Save</${Button}>

        </${Group}>
        <${Group}>
    <${RichTextEditor} editor=${editor} variant="subtle">
    <${RichTextEditor.Toolbar} sticky stickyOffset=${60}>
    <${RichTextEditor.ControlsGroup}>
    <${RichTextEditor.Bold} icon=${IconBold}/>
    <${RichTextEditor.Italic} />
    <${RichTextEditor.Underline} />
    <${RichTextEditor.Strikethrough} />
    <${RichTextEditor.ClearFormatting} />
    <${RichTextEditor.Highlight} />
    <${RichTextEditor.Code} />
    </${RichTextEditor.ControlsGroup}>
    </${RichTextEditor.Toolbar}>

      <${RichTextEditor.Content} />
    </${RichTextEditor}>

        </${Group}>
      </${Stack}>
  </${Box}>
`
  );
}
