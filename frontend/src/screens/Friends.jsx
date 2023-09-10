import React, { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import {Stack,Box, Typography, Avatar, useMediaQuery, useTheme, CircularProgress, Button} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { BASE_URL, BUCKET_URL, SERVER_DOWN_MESSAGE } from '../envVariables'
import { loggedInUserContext } from '../context/user/Usercontext'
import { Link, useNavigate } from 'react-router-dom'
import Lottie from 'lottie-react';
import emptyfriendlistanimation from '../animations/emptyfriendlistanimation.json'
import { handleApiResponse } from '../utils/common'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'


export const Friends = () => {
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const loggedInUser=useContext(loggedInUserContext)
  const navigate=useNavigate()
  const [friends,setFriends]=useState([])
  const theme=useTheme()
  const is480=useMediaQuery(theme.breakpoints.down("480"))
  const [loading,setLoading]=useState(false)

  // 401 handled ✅
  const getFriends=async()=>{
    setLoading(true)
    try {
      const response=await fetch(`${BASE_URL}/getfriends`,{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":'application/json'
        },
        body:JSON.stringify({
          'userid':loggedInUser.loggedInUser.userid
        })
      })

      const result=await handleApiResponse(response)
      if(result.success){
        setFriends(result.data)
      }
      else if(result.logout){
        setGlobalAlertOpen({state:true,message:result.message})
        navigate("/login")
      }
      else{
        // setGlobalAlertOpen({state:true,message:result.message})
      }

    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(loggedInUser.loggedInUser && friends.length === 0){

      getFriends()
    }
  },[loggedInUser])

  return (
    <>
    <Navbar/>
    <Leftbar/>

    <Stack flex={"1"} spacing={5} justifyContent={'center'} alignItems={"center"} mt={2}>
        <Stack width={is480?"100%":'70%'} p={2}>

              <Stack spacing={5} height={"42rem"} sx={{overflowY:"scroll"}} justifyContent={'flex-start'} alignItems={"flex-start"} mt={5}>
                {loading?(<Box><CircularProgress/></Box>):
                (
                friends.length!==0?
                (
              friends.map((data)=>{
                return <Stack key={data.userid} direction={'row'} justifyContent={'space-between'}>
                          <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Avatar component={Link} src={`${BUCKET_URL}/${data.profilePicture}`} to={`/profile/${data.username}`} sx={{"width":`${is480?"5rem":"10rem"}`,'height':`${is480?"5rem":"10rem"}`}}></Avatar>
                          <Stack>
                                <Typography component={Link} to={`/profile/${data.username}`} sx={{"textDecoration":"none",color:"black"}} variant='h6' fontWeight={300}>{data.username}</Typography>
                                <Typography variant='body1' fontWeight={300}>{data.location}</Typography>
                          </Stack>
                          </Stack>
                        </Stack>
              }))
              :(
                <Stack width={'20rem'} justifySelf={'center'} alignSelf={'center'} justifyContent={'center'} alignItems={'center'}>
                  <Lottie animationData={emptyfriendlistanimation}></Lottie>
                  <Typography>You have no friends currently!</Typography>
                  <Typography>I'm StangCat✨ wanna be my friend?</Typography>
                </Stack>
              )
              )
            }
            </Stack>
            </Stack>



                </Stack>
                </>
  )
}
