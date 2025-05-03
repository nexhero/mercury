import React, {createContext,useEffect,useState} from 'react';
import {html} from 'htm/react';
import { Notifications } from "@mantine/notifications";
import { notifications } from "@mantine/notifications";

const _AUTOCLOSE_ = 10000;
export const NotificationContext = createContext();
export const  NotificationProvider=({children})=>{
    const createSuccess = (message,title='Success')=>{
        notifications.show({
            title:title,
            color:'green',
            message:message,
            autoClose: _AUTOCLOSE_,
        });
    };
    const createInfo = (message,title='Info')=>{
        notifications.show({
            title:title,
            color:'indigo',
            message:message,
            autoClose: _AUTOCLOSE_,
        });
    };
    const createError = (message,title='Error')=>{
        notifications.show({
            title:title,
            color:'red',
            message:message,
            autoClose: _AUTOCLOSE_,
        });
    };

    return html`
<${NotificationContext.Provider} value=${{createSuccess,createInfo,createError}}>
  <${Notifications}/>
  ${children}
<//>

`;
};
