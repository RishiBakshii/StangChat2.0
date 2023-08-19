import React, { useEffect,useState,useMemo, createContext} from 'react'
import { Navbar } from '../components/Navbar'
import {Box,Button,Stack,styled} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Feed } from '../components/Feed'
import { Rightbar } from '../components/Rightbar'
import { useNavigate } from 'react-router-dom'


export const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const userInformation=createContext();
export const feedData=createContext()
export const feedUpdateContext=createContext();


export const Home = () => {
    const [loggedInUser,setLoggedInUser]=useState({})
    const [feed,setFeed]=useState([])

    const getLoggedInUser=async()=>{
        const authToken=localStorage.getItem("authToken")

        try {
            const response=await fetch(`${BASE_URL}/decode_token`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "authToken":authToken
                    })
                })
        
            const json=await response.json()    
        
            if(response.ok){
                try{
                    const response2=await fetch(`${BASE_URL}/get_user_info`,{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        "userID":json.decoded_token.user_id
                            })
                    })
            
                    const json2=await response2.json()
                    console.log(json2.data)
                    setLoggedInUser(json2.data)
                }
                catch(error){
                    alert(error)
                }
        }
    
        } catch (error) {
            alert(error)
        }  
    }

    const getFeed=async()=>{
        try {

            const response=await fetch(`${BASE_URL}/getfeed`,{
                method:"POST",
            })

            const json=await response.json()

            if(response.ok){
                setFeed(json)
            }
            if (response.status==500){
                alert(json.message)
            }
            
        } catch (error) {
            alert(error)
        }
    }

    useEffect(()=>{
        getLoggedInUser()
        getFeed()
    },[])

  return (
    <userInformation.Provider value={loggedInUser}>
    <Navbar username={loggedInUser.username} profileURL={`${BASE_URL}/${loggedInUser.profilePicture}`}/>

        
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems="flex-start">
                <Leftbar loggedInUser={loggedInUser}/>

                <feedData.Provider value={feed}>
                    <Feed/>
                </feedData.Provider>

                <Rightbar/>
        </Stack>  

    </userInformation.Provider>
  )
}
