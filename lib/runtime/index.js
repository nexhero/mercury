import React, { useContext,createContext, useState,useEffect } from 'react';
import {html} from 'htm/react';
import Corestore from 'corestore';
import RAM from 'random-access-memory';
import Mercury from 'mercury-core';
import NoteObject from 'mercury-core/lib/objects/note.mjs';
import {useMap} from '@mantine/hooks';
export const MercuryContext = createContext();

export const MercuryProvider = ({children}) =>{

    const openedDocs = useMap([]);
    const [activeDoc,setActiveDoc] = useState(null);
    const [store,setStore] = useState(Pear.config.dev?new Corestore('./temp_store.db'):new Corestore(Pear.config.storage));
    const [mercury,setMercury] = useState(null);
    const [documents,setDocuments] = useState([]); // Store the all documents in tree format temporally
    const [tags,setTags] = useState([]);           // Store temporally all the tags

    const duplicateDocument = (doc)=>{
        const new_doc = new NoteObject(mercury.db);
        new_doc.setLabel(doc.label + ' copy');
        new_doc.setContent(doc.content);
        new_doc.setTag(doc.tag);
        new_doc.save()
            .then(()=>getAllDocuments())
            .catch((err)=>console.log(`*** Unable to duplicate docuemtn ${String(err)}`));
    };

    const deleteDocument = async(doc)=>{
        await mercury.db.removeDocument(doc.id);
        getAllDocuments();
    };
    const deleteDocumentByTag = async(tag)=>{
        for await(const entry of mercury.db.view.createReadStream()){
            const doc = entry.value;
            if (doc.tag === tag) {
                await mercury.db.removeDocument(doc.id);
            }
        }
        getAllDocuments();

    };
    const openDocument = (json_obj)=>{
        const docObj = new NoteObject(mercury.db);
        docObj.fromJson(json_obj);
        openedDocs.set(docObj.id,docObj);
        setActiveDoc(docObj.id);
    };
    /**
     * Create a new note document
     * and set it as active doc
     */
    const createDocument = ()=>{
        const doc = new NoteObject(mercury.db);
        openedDocs.set(doc.id,doc);
        setActiveDoc(doc.id);

    };
    /**
     * Close one of the opened document by id
     * @param {Number} id
     */
    const closeOneOpen = (id) =>{
        openedDocs.delete(id);
        openedDocs.size?
            setActiveDoc(openedDocs.entries().next().value[0]):
            setActiveDoc(null);
    };
    const getAllDocuments = ()=>{
        mercury.db.getAllDocuments()
            .then((result)=>{
                setDocuments(result.tree);
                setTags(result.tags);
            });
    };
    useEffect(()=>{
        Pear.config.dev?console.log("*** RUNNING DEV MODE ***"): null;
    },[]);

    /////////////////////////////////
    // Create the object mercury   //
    // once the corestore is ready //
    /////////////////////////////////
    useEffect(()=>{
        store.ready()
            .then(()=>{
                console.log('*** Store ready ***');
                setMercury(new Mercury(store));
            });
    },[store]);

    /////////////////////////////////////
    // Setup mercury autobase          //
    // and start listen for connetions //
    /////////////////////////////////////
    useEffect(()=>{
        (async function () {
            if (mercury) {
                await mercury.initialize();
                console.log('*** Mercury ready ***');
                mercury.listen();
                getAllDocuments();
                mercury.db.on('update',()=>{
                    getAllDocuments();
                });
            }
        })();
    },[mercury]);


    return html`

<${MercuryContext.Provider} value=${{
openedDocs,
documents,
createDocument,
activeDoc,
setActiveDoc,
 closeOneOpen,
 openDocument,
duplicateDocument,
deleteDocument,
deleteDocumentByTag,
tags,


}}>
  ${children}
</${MercuryContext.Provider}>
            `;
};
