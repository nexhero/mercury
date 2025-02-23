import React from 'react'
import { createRoot } from 'react-dom/client';
import { html } from 'htm/react';
import Layout from './components/layout'
import { createTheme, MantineProvider, Container, Notification } from '@mantine/core';
// import applyCssFromString from './lib/css'
// import _style from './lib/style'
import { PeerProvider} from './lib/peer'
import { NotificationProvider} from './lib/notification'
import { ContextMenuProvider } from 'mantine-contextmenu';

// applyCssFromString(_style)

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
                  <${ContextMenuProvider}>
                    <${Layout}/>
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
