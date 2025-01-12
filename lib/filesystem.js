export const TYPES = Object.freeze({
  NOTE:'note',
  NIL:'nil',
  FOLDER:'folder'
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
     * @param {string} [title=''] - The title of the type.
     * @param {string} [created_at=new Date().toString()] - The creation timestamp.
     * @param {string} [updated_at=new Date().toString()] - The last updated timestamp.
     * @param {string} [type=TYPES.NONE] - The type of the instance.
     */
  constructor(id = '', title = '', created_at = new Date().toString(), updated_at = new Date().toString(), type = TYPES.NIL) {
        this.id = id.length === 0 ? generateId() : id;
        this.title = title;
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
     * @param {string} [title='Untitle note'] - The title of the note.
     * @param {string} [content=''] - The content of the note.
     * @param {string} [created_at=new Date().toString()] - The creation timestamp.
     * @param {string} [updated_at=new Date().toString()] - The last updated timestamp.
     */
    constructor(
        id = '',
        title = 'Untitle note',
        content = '',
        created_at = new Date().toString(),
        updated_at = new Date().toString()
    ) {
        super(id, title, created_at, updated_at, TYPES.NOTE);
        this.content = content;
    }

    /**
     * Sets the title of the note.
     * @param {string} title - The new title of the note.
     */
    setTitle(title) {
        this.title = title;
    }

    /**
     * Populates the instance from a JSON object.
     * @param {Object} data - The data to populate the instance with.
     * @param {string} data.id - The unique identifier of the note.
     * @param {string} data.title - The title of the note.
     * @param {string} data.content - The content of the note.
     * @param {string} data.created_at - The creation timestamp.
     * @param {string} data.updated_at - The last updated timestamp.
     * @param {string} data.type - The type of the instance.
     */
    fromJson(data) {
        this.id = data.id;
        this.title = data.title;
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
            title: this.title,
            content: this.content,
            created_at: this.created_at,
            updated_at: this.updated_at,
            type: this.type
        };
    }
}

/**
 * Represents a directory type.
 * @extends BaseTypeClass
 */
export class TagClass extends Base {
    /**
     * Creates an instance of DirectoryClass.
     * @param {string} [id=generateId()] - The unique identifier for the directory.
     * @param {string} [title='Untitle note'] - The title of the directory.
     * @param {string} [parent=''] - The parent directory identifier, null if parent is not set.
     * @param {string} [created_at=new Date().toString()] - The creation timestamp.
     * @param {string} [updated_at=new Date().toString()] - The last updated timestamp.
     */
    constructor(
        id = generateId(),
        title = 'New Folder',
        color=""
        created_at = new Date().toString(),
        updated_at = new Date().toString()
    ) {
        super(id, title, created_at, updated_at, TYPES.DIRECTORY);
        this.parent = parent;
    }

    /**
     * Set the folder name
     * @param {string} title - Name of the folder
     */
    setTitle(title){
        this.title = title;
    }
    /**
     * Populates the instance from a JSON object.
     * @param {Object} data - The data to populate the instance with.
     * @param {string} data.id - The unique identifier of the note.
     * @param {string} data.title - The title of the note.
     * @param {string} data.content - The content of the note.
     * @param {string} data.created_at - The creation timestamp.
     * @param {string} data.updated_at - The last updated timestamp.
     * @param {string} data.type - The type of the instance.
     * @param {string} data.parent - Parent of the folder
     */
    fromJson(data){
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
        this.type = data.type;
        this.parent = data.parent
    }
    /**
     * Converts the instance to a JSON object
     * @return {Object} - The JSON representation of the instance
     */
    toJson(){
        return {
            id: this.id,
            title: this.title,
            created_at: this.created_at,
            updated_at: this.updated_at,
            type: this.type,
            parent: this.parent
        };
    }
}
