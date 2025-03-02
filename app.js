import React from 'react'
import { createRoot } from 'react-dom/client';
import { html } from 'htm/react';
import Layout from './components/layout'
import { createTheme, MantineProvider, Container, Notification } from '@mantine/core';
import { PeerProvider} from './lib/peer'
import { NotificationProvider} from './lib/runtime/notification'
import { NoteProvider} from './lib/runtime/note'
import { ContextMenuProvider } from 'mantine-contextmenu';

const theme = createTheme({
  /** Put your mantine theme override here */
});

const root = createRoot(document.querySelector('#root'))

const darkTheme = createTheme({
  palette:{

    mode:'dark'
  }
})

function App(){

  return (
    html`
        <${MantineProvider} defaultColorScheme="dark">
            <${PeerProvider}>
              <${MantineProvider} defaultColorScheme="auto">
                  <${NotificationProvider}>
                  <${NoteProvider}>
                  <${ContextMenuProvider}>
                    <${Layout}/>
                  <//>
                  <//>
                  <//>
              <//>
            </${PeerProvider}>
        </${MantineProvider}>

    `
  )
}

root.render(
  html`
    <${App}/>
`
)
