import React from 'react'
import { createRoot } from 'react-dom/client';
import { html } from 'htm/react';
import Layout from './components/layout'
import { createTheme, MantineProvider, Container } from '@mantine/core';
import applyCssFromString from './lib/css'
import _style from './lib/style'
import useMercury from './lib/core'
applyCssFromString(_style)
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
  useMercury()
  return (
    html`
    <${MantineProvider} defaultColorScheme="dark">
      <${Container} fluid h=${100}>
        <${Layout}/>
      </${Container}>
    </${MantineProvider}>

    `
  )
}

root.render(
  html`
    <${App}/>
`
)
