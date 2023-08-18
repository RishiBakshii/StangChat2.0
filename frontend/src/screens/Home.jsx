import React, { useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import {Box,Stack,styled} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Feed } from '../components/Feed'
import { Rightbar } from '../components/Rightbar'
import { useNavigate } from 'react-router-dom'


const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const Main=styled("main")(({theme})=>({
    // backgroundColor:"black"
}))

export const Parentstack=styled(Stack)(({theme})=>({
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"flex-start",
}))


export const Home = () => {

    const [loggedInUser,setLoggedInUser]=useState({})
    const navigate=useNavigate()

    const fetchUserDetails=async(userid)=>{

        try {
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
        } catch (error) {
            alert(error)
        }
        
    
        
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
            setLoggedInUser(userdata)
        }
    
        } catch (error) {
            alert(error)
        }
        
    
    }

    useEffect(() => {
        console.log(`${BASE_URL}/${loggedInUser.profilePicture}`)
        const authToken=localStorage.getItem("authToken")
        
        authToken?(
            decodeTokenAndFetchLoggedInUser()
        ):(
            navigate("/login")
        )
      return()=>{}
      }, []);

      console.log(loggedInUser)


  return (
    <>
    <Navbar username={loggedInUser.username} profileURL={`${BASE_URL}/${loggedInUser.profilePicture}`}/>

    <Main>
        
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems="flex-start">
                <Leftbar username={loggedInUser.username}/>
                <Feed/>
                <Rightbar/>
        </Stack>

    </Main>    

    </>
  )
}
