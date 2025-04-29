import React, { useContext,createContext, useState,useEffect } from 'react';
import {html} from 'htm/react';
import Corestore from 'corestore';
import RAM from 'random-access-memory';
import Mercury from 'mercury-core';
export const MercuryContext = createContext();

export const MercuryProvider = ({children}) =>{

    const [store,setStore] = useState(Pear.config.dev?new Corestore('./temp_store.db'):new Corestore(Pear.config.storage));
    const [mercury,setMercury] = useState(null);
    const [documents,setDocuments] = useState([{label:'This is the label',value:'some random value',type:'document'}]);


    const getAllDocuments = ()=>{
        mercury.db.getAllDocuments()
            .then((arr)=>{
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

                mercury.db.on('update',()=>{
                    getAllDocuments();
                });
            }
        })();
    },[mercury]);
    return html`

<${MercuryContext.Provider} value=${{documents}}>
  ${children}
</${MercuryContext.Provider}>
    `;
};
