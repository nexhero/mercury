import React, { useContext,createContext } from 'react'
import {html} from 'htm/react'
import { NoteContext } from './note'
import { NotificationContext} from './notification'
import {StorageContext,StorageProvider} from './hyper'
import {SwarmContext,SwarmProvider} from './swarm'
export const MercuryContext = createContext()
export const MercuryProvider = ({children}) =>{
  return html`
    <${StorageProvider}>
    <${SwarmProvider}>
    <${MercuryContext.Provider} value=${{}}>
      ${children}
    <//>
    <//>
    <//>
  `;
}

export const Mercury = {
  noti:()=>useContext(NotificationContext),
  hyper : ()=>useContext(NoteContext), //Remove, it will remplace by storage
  storage:()=>useContext(StorageContext),
  swarm:()=>useContext(SwarmContext)
}
