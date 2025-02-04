export const TYPES = Object.freeze({
  NOTE:'note',
  NIL:'nil',
  TAG:'tag'
})

function generateId(){
  const _id = Math.random().toString(36).substring(2,9)
  return _id
}


/**
 * Represents a base type with common properties and methods.
 */
class Base {
    /**
     * @param {string} [id=''] - The unique identifier for the type.
     * @param {string} [label=''] - The label of the type.
     * @param {string} [created_at=new Date().toString()] - The creation timestamp.
     * @param {string} [updated_at=new Date().toString()] - The last updated timestamp.
     * @param {string} [type=TYPES.NONE] - The type of the instance.
     */
  constructor(id = '', label = '', created_at = new Date().toString(), updated_at = new Date().toString(), type = TYPES.NIL) {
        this.id = id.length === 0 ? generateId() : id;
        this.label = label;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.type = type;
    }

    /**
     * Saves the current instance.
     * @param {function} [onSuccess=(data) => {}] - The callback to execute on success.
     * @param {function} [onError=(err) => {}] - The callback to execute on error.
     */
    save(onSuccess = (data) => {}, onError = (err) => {}) {
        console.log('Base save method');
    }

    /**
     * Deletes the current instance.
     * @param {function} [onSuccess=(data) => {}] - The callback to execute on success.
     * @param {function} [onError=(err) => {}] - The callback to execute on error.
     */
    delete(onSuccess = (data) => {}, onError = (err) => {}) {
        console.log('Base delete method');
    }

    /**
     * Populates the instance from a JSON object.
     * @param {Object} data - The data to populate the instance with.
     */
    fromJson(data) {
        console.log("Base fromJson method", data);
    }

    /**
     * Converts the instance to a JSON object.
     * @return {Object} The JSON representation of the instance.
     */
    toJson() {
        console.log("Base toJson method");
    }
}

/**
 * Represents a note type.
 * @extends Base
 */
export class NoteClass extends Base {
    /**
     * Creates an instance of NoteClass.
     * @param {string} [id=''] - The unique identifier for the note.
     * @param {string} [label='Unlabel note'] - The label of the note.
     * @param {string} [content=''] - The content of the note.
     * @param {string} [created_at=new Date().toString()] - The creation timestamp.
     * @param {string} [updated_at=new Date().toString()] - The last updated timestamp.
     */
    constructor({
        id = '',
        label = 'Unlabel note',
        content = '',
        tag = '',
        created_at = new Date().toString(),
        updated_at = new Date().toString()
    }={}) {
        super(id, label, created_at, updated_at, TYPES.NOTE);
        this.content = content;
        this.tag = tag
    }

    /**
     * Sets the label of the note.
     * @param {string} label - The new label of the note.
     */
    setLabel(label) {

        this.label = label;
    }
    /**
     * Sets the label of the note.
     * @param {Array} tag - Note belong tag.
     */
    setTag(tag) {
        console.log('val tag:',tag)
        this.tag = tag?tag:''
    }

    setContent(data){
        this.content = data?data:''
    }

    /**
     * Populates the instance from a JSON object.
     * @param {Object} data - The data to populate the instance with.
     * @param {string} data.id - The unique identifier of the note.
     * @param {string} data.label - The label of the note.
     * @param {string} data.content - The content of the note.
     * @param {string} data.created_at - The creation timestamp.
     * @param {string} data.updated_at - The last updated timestamp.
     * @param {string} data.type - The type of the instance.
     */
    fromJson(data) {
        this.id = data.id;
        this.label = data.label;
        this.content = data.content;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.type = data.type;
    }

    /**
     * Converts the instance to a JSON object.
     * @return {Object} The JSON representation of the instance.
     */
    toJson() {
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

