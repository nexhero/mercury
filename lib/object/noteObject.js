import {BaseObject} from './baseOjbect'
import {html} from 'htm/react'
export default class NoteObject extends BaseObject {
  constructor(){
    super()
    this.type = 'note'
  }
}
