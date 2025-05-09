import {BaseObject} from './baseOjbect'
import {html} from 'htm/react'
export default class NoteObject extends BaseObject {
  constructor(storage){
    super(storage)
    this.type = 'note'
  }
}
