import { useEffect, useState } from "react";
import { loggedInUserContext } from "./Usercontext";
import { fetchLoggedInUser } from "../../api/user";

import React from 'react'

export const Userstate = ({children}) => {
    
    const [loggedInUser,setLoggedInUser]=useState({})

    const updateLoggedInUser=(updatedData)=> {
        console.log("updation funtion called for user state!😮")
        setLoggedInUser(updatedData)
        console.log("updated user state is -->>")
        console.log(loggedInUser)
    }

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


  return (
    <loggedInUserContext.Provider value={{loggedInUser,updateLoggedInUser}}>
        {children}
    </loggedInUserContext.Provider>
  )
}
