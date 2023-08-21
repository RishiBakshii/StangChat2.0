import React, { useContext, useEffect } from 'react'
import { Navbar } from '../components/Navbar'
import {Stack,Box, Avatar, Typography, Button} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Rightbar } from '../components/Rightbar'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useParams } from 'react-router-dom'
import { BASE_URL, } from './Home'
import { loggedInUserContext } from '../context/user/Usercontext'


export const Profile = () => {
  const loggedInUser=useContext(loggedInUserContext)

  // const getUserPost=async()=>{
  //   try {
  //     const response=await fetch(`${BASE_URL}/getuserpost`,{
  //       method:"POST",
  //       headers:{
  //         'Content-Type':"application/json"
  //       },
  //       body:JSON.stringify({
  //         "userid":loggedInUser.userid
  //       })
  //     })

  //     const json=await response.json()

  //     if (response.ok){
  //       alert("success!!")
  //     }
  //     if(response.status==400){
  //       alert(json.message)
  //     }
  //     if (response.status==500){
  //       alert(json.message)
  //     }




  //   } catch (error) {
  //     alert(error)
  //   }
  // }

  // useEffect(()=>{
  //   getUserPost()
  // },[])
  // const {username}=useParams()
  return (
    <>
    <Navbar/>
        
            <Stack>
                <Box position={'fixed'}>
                    <Leftbar/>
                </Box>
            </Stack>

            <Stack flex={"1"} spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>

                <Stack padding={'1.5rem'} bgcolor={'#f0f0f0'} borderRadius={'.6rem'} width={'50%'} height={"40rem"} justifyContent={'flex-start'} alignItems={'flex-start'}>

                  {/* name and avatar */}
                  <Stack spacing={3}>
                      <Avatar sx={{width:"10rem",height:"10rem"}} alt="Cindy Baker" src="https://mui.com/static/images/avatar/2.jpg" />
                      <Stack direction={'row'} alignItems={'center'} spacing={2}>
                          <Typography variant='h4' fontWeight={300}>{loggedInUser.loggedInUser.username}</Typography>
                          <Typography variant='h6' fontWeight={300}>He/Him</Typography>
                      </Stack>
                  </Stack>

                  {/* about */}
                  <Stack mt={2}>
                      <Typography variant='body1'>{loggedInUser.loggedInUser.bio}</Typography>
                  </Stack>

                  {/* social following and followers */}
                  <Stack direction={'row'} spacing={2} mt={2}>
                    <Typography variant='h6' fontWeight={300}>{loggedInUser.loggedInUser.followers} followers</Typography>
                    <Typography variant='h6' fontWeight={300}>{loggedInUser.loggedInUser.followers} following</Typography>
                  </Stack>


                  {/* tag and location status */}
                  <Stack mt={3} spacing={.3}>
                    <Typography variant='body1'>Teacher</Typography>
                    <Typography variant='body1'>Vasundhara</Typography>
                    <Button variant='text' startIcon={<LinkedInIcon/>}>JohnDoe</Button>
                  </Stack>

                </Stack>
            </Stack>  
    </>
  )
}
