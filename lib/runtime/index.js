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
    const [documents,setDocuments] = useState([]);

    const openDocument = (id)=>{
        documents.forEach((doc)=>{
            if (doc.value === id) {
                const docObj = new NoteObject(mercury.db);
                docObj.fromJson(doc);
                console.log(docObj);
                openedDocs.set(doc.id,docObj);
                setActiveDoc(docObj.id);
                return;
            }
        });
    };
    /**
     * Create a new note document
     * and set it as active doc
     */
    const createDocument = ()=>{
        const doc = new NoteObject(mercury.db);
        openedDocs.set(doc.id,doc);
        setActiveDoc(doc.id);
        console.log(`New document creatd ${doc.id}`);
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
            .then((arr)=>{
                console.log(arr);
                setDocuments(arr);
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

<${MercuryContext.Provider} value=${{openedDocs,documents,createDocument,activeDoc,setActiveDoc, closeOneOpen, openDocument }}>
  ${children}
</${MercuryContext.Provider}>
    `;
};
