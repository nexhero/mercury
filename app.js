import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { html } from 'htm/react';
import { MantineProvider, Container, Notification } from '@mantine/core';
import {MercuryProvider} from './lib/runtime';
import {NotificationProvider} from './lib/runtime/notification';
import { ContextMenuProvider } from 'mantine-contextmenu';
import Shell from './pages/shell.js';

const root = createRoot(document.querySelector('#root'));

function App(){

  return html`
<${MantineProvider} defaultColorScheme="dark" style=${{backgroundColor:'white'}}>
  <${NotificationProvider}>
    <${MercuryProvider}>
      <${Shell}/>
    </${MercuryProvider}>
  </${NotificationProvider}>
</${MantineProvider}>
  `;
}
root.render(
  html`
<${App}/>
  `
);
