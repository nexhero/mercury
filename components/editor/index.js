import { html } from 'htm/react';
import {TextInput,Box, Stack,Button,Group} from '@mantine/core'
import EmptyEditor from './empty'
import Editor from './editor'
import {activeNoteAtom} from '../../lib/core'
import {useAtomValue} from 'jotai'
export default function NoteEditor() {
  const activeNote = useAtomValue(activeNoteAtom)
  if (activeNote!== null) {
    return(
      html`
      <${Box}>
          <${Editor}/>
      </${Box}>
      `
    )
  }
  return (
    html`
    <${Box}>
      <${EmptyEditor}/>
  </${Box}>
`
  );
}
