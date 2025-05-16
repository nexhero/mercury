export {TagFormProvider as TagFormDialog} from './tagForm.js'
export {TagFormContext as TagFormContext} from './tagForm.js'
import {TagFormProvider} from './tagForm.js'
import {html} from 'htm/react';
import {Box} from '@mantine/core';

export default function DialogsProvider({children}){
    return html`
<${Box}>
<${TagFormProvider}>
${children}
</${TagFormProvider}>
</${Box}>
`
}
