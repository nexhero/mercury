import React, {useEffect,useState} from 'react'
import {atom,useSetAtom} from 'jotai'

const notificationAtom = atom(null)

export function useNotificationFn(){
  const setNotification = useSetAtom(notificationAtom)

  const createSuccess = (message,title='Success')=>{
    setNotification({
      title:title,
      color:'green',
      message:message
    })
  }

  const createInfo = (message,title='Info')=>{
    setNotification({
      title:title,
      color:'indigo',
      message:message
    })
  }
  const createError = (message,title='Error')=>{
    setNotification({
      title:title,
      color:'red',
      message:message
    })
  }
  return{
    createSuccess,
    createInfo,
    createError
  }
}

export default notificationAtom
