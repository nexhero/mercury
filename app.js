import React from 'react'
import { createRoot } from 'react-dom/client';
import { html } from 'htm/react';
import Layout from './components/layout'
import { MantineProvider, Container, Notification } from '@mantine/core';

import { NotificationProvider} from './lib/runtime/notification'

import {MercuryProvider } from './lib/runtime'
import { ContextMenuProvider } from 'mantine-contextmenu';

const root = createRoot(document.querySelector('#root'))

function App(){

  return (
    html`
        <${MantineProvider} defaultColorScheme="dark">
          <${NotificationProvider}>
            <${ContextMenuProvider}>
              <${MercuryProvider}>
                <${Layout}/>
              <//>
             <//>
          <//>
        </${MantineProvider}>

    `
  )
}

root.render(
  html`
    <${App}/>
`
)
