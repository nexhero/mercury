import {html} from 'htm/react'

function generateId(){
  const _id = Math.random().toString(36).substring(2,9)
  return _id
}

export class BaseObject {
  constructor(database){
    this.id = generateId()
    this.label = ''
    this.content = ''
    this.tag = ''
    this.created_at = new Date().toString()
    this.updated_at = new Date().toString()
    this.type = 'base'
    this.db = database
  }
  updatedAt(){
    this.updated_at = new Date().toString()
  }
  save(){
    console.log(this.db)
    this.updatedAt()
    console.log('-- saving document..')
    return this.db.saveDocument(this.id,this.toJson())
  }
  delete(){
    return this.db.removeDocument(this.id)
  }
  setLabel(label){
    this.label = label
  }
  setTag(tag){
    this.tag = tag
  }
  setContent(content){
    this.content = content
  }
  fromJson(data){
    {
      this.id = data.id;
      this.label = data.label;
      this.content = data.content;
      this.created_at = data.created_at;
      this.updated_at = data.updated_at;
      this.type = data.type;
    }

  }
  toJson(){
    return {
      id: this.id,
      label: this.label,
      content: this.content,
      tag:this.tag,
      created_at: this.created_at,
      updated_at: this.updated_at,
      type: this.type
    };

  }
}
