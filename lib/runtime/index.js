import React, { useContext,createContext } from 'react'
import {html} from 'htm/react'
import { NoteContext } from './note'
import { NotificationContext} from './notification'
import {StorageContext,StorageProvider} from './hyper'
export const MercuryContext = createContext()
export const MercuryProvider = ({children}) =>{
  return html`
    <${StorageProvider}>
    <${MercuryContext.Provider}>
      ${children}
    <//>
    <//>
  `;
}

export const Mercury = {
  noti:()=>useContext(NotificationContext),
  hyper : ()=>useContext(NoteContext),
  storage:()=>useContext(StorageContext)
}
