import React, { useContext,createContext } from 'react'
import {html} from 'htm/react'
import { NotificationContext} from './notification'
import {SwarmContext,SwarmProvider} from './swarm'
import {StorageContext,StorageProvider} from './storage'
import { DocumentContext, DocumentProvider } from './document'
export const MercuryContext = createContext()
export const MercuryProvider = ({children}) =>{
  return html`
    <${StorageProvider}>
    <${SwarmProvider}>
    <${DocumentProvider}>
    <${MercuryContext.Provider} value=${{}}>
      ${children}
    <//>
    <//>
    <//>
    <//>
  `;
}

export const Mercury = {
  noti:()=>useContext(NotificationContext),
  storage:()=>useContext(StorageContext),
  documents : ()=>useContext(DocumentContext),
  swarm:()=>useContext(SwarmContext)
}
