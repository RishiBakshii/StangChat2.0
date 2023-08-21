import { useEffect, useState } from "react";
import { loggedInUserContext } from "./Usercontext";
import { fetchLoggedInUser } from "../../api/user";

import React from 'react'

export const Userstate = ({children}) => {
    
    const [loggedInUser,setLoggedInUser]=useState({})

    const getLoggedInUserandUpdateState=async()=>{
        const userdata=await fetchLoggedInUser()
        updateLoggedInUser(userdata)
    }

    useEffect(()=>{
        const authToken=localStorage.getItem("authToken")

        if(authToken){
            getLoggedInUserandUpdateState()
        }
    },[])

    function updateLoggedInUser(updatedData) {
        setLoggedInUser(updatedData)
    }

  return (
    <loggedInUserContext.Provider value={{loggedInUser,updateLoggedInUser}}>
        {children}
    </loggedInUserContext.Provider>
  )
}
