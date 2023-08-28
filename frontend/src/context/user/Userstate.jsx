import { useEffect, useState } from "react";
import { loggedInUserContext } from "./Usercontext";
import { fetchLoggedInUser } from "../../api/user";

import React from 'react'

export const Userstate = ({children}) => {
    
    const [loggedInUser,setLoggedInUser]=useState({})

    const updateLoggedInUser=(updatedData)=> {
        setLoggedInUser(updatedData)
    }

    const getLoggedInUserandUpdateState=async()=>{
        const userdata=await fetchLoggedInUser()
        updateLoggedInUser(userdata)
    }

    useEffect(()=>{
        const loggedIn=localStorage.getItem("loggedIn")
        if(loggedIn){
            getLoggedInUserandUpdateState()
        }
    },[])


  return (
    <loggedInUserContext.Provider value={{loggedInUser,updateLoggedInUser}}>
        {children}
    </loggedInUserContext.Provider>
  )
}
