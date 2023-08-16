import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import {Box,Stack,styled} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Feed } from '../components/Feed'
import { Rightbar } from '../components/Rightbar'

const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const Main=styled("main")(({theme})=>({
    width:"100",
    padding:"1rem 1rem"
}))

export const Parentstack=styled(Stack)(({theme})=>({
    justifyContent:"space-between",
    flexDirection:"row"
}))

const fetchUserDetails=async(userid)=>{
    const response=await fetch(`${BASE_URL}/get_user_info`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            "userID":userid
        })
    })

    const json=await response.json()
    return json.data
}

const decodeTokenAndFetchLoggedInUser=async()=>{
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
        const userdata =await fetchUserDetails(json.decoded_token.user_id)
        return userdata
    }

    } catch (error) {
        alert(error)
    }
    

}

export const Home = () => {
    useEffect(() => {

        const getLoggedInUser=async()=>{
            const finaldata=await decodeTokenAndFetchLoggedInUser()
            setLoggedInUser(finaldata)
        }

        getLoggedInUser()
      return()=>{}
      }, []);
    
      const [loggedInUser,setLoggedInUser]=useState({})

  return (
    <>
    <Navbar/>

    <Main>
        
        <Parentstack>
            <Stack flex={"10%"}>
                <Box position={'fixed'}>
                    <Leftbar username={loggedInUser.username}/>
                </Box>
            </Stack>

            <Stack flex={"40%"} spacing={5} justifyContent={'center'} alignItems={"center"}>
                <Feed/>
            </Stack>  
            
            <Stack flex={"20%"}  justifyContent={'flex-start'} alignItems={'center'}>
                <Box position={'fixed'}>
                    <Rightbar/>
                </Box>
            </Stack>
           
        </Parentstack>

    </Main>
    <h1>{loggedInUser.email}</h1>
    

    </>
  )
}
