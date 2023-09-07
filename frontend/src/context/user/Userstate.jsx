import { useContext, useEffect, useState } from "react";
import { loggedInUserContext } from "./Usercontext";
import { fetchLoggedInUser } from "../../api/user";
import { GlobalAlertContext} from '../globalAlert/GlobalAlertContext'
import {useNavigate} from 'react-router-dom'

export const Userstate = ({children}) => {
    
    const navigate=useNavigate()
    const [loggedInUser,setLoggedInUser]=useState({})
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)

    const updateLoggedInUser=(updatedData)=> {
        setLoggedInUser(updatedData)
    }

    const getLoggedInUserandUpdateState=async()=>{
        const result=await fetchLoggedInUser()
        if(result.success){
            updateLoggedInUser(result.data.data)
        }
        else if(result.logout){
            setGlobalAlertOpen({ state: true, message: result.message })
            navigate("/login")
        }
        else{
            setGlobalAlertOpen({ state: true, message: result.message });
        }
    }

    useEffect(()=>{
        const loggedIn=localStorage.getItem("loggedIn")
        if(loggedIn){
            getLoggedInUserandUpdateState()
        }
        else{
            navigate('/login')
        }
    },[])


  return (
    <loggedInUserContext.Provider value={{loggedInUser,updateLoggedInUser,setLoggedInUser}}>
        {children}
    </loggedInUserContext.Provider>
  )
}
