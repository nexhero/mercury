import React, { useContext } from 'react'
import { NoteContext } from './note'
import { NotificationContext} from './notification'

export const Mercury = {
  noti: ()=>useContext(NotificationContext),
  hyper : ()=>useContext(NoteContext)
}
