import React, { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Box,CircularProgress, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Rightbar } from '../components/Rightbar'
import { Link,useNavigate } from 'react-router-dom'
import { BASE_URL, BUCKET_URL, SERVER_DOWN_MESSAGE } from '../envVariables'
import { loggedInUserContext } from '../context/user/Usercontext'
import { handleApiResponse } from '../utils/common'
import { LogoutUser } from '../api/auth'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import PlaceIcon from '@mui/icons-material/Place';
import { handleSpace } from './Signup'
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';


export const Search = () => {
  const {loggedInUser}=useContext(loggedInUserContext)
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const [query,setQuery]=useState('')
  const [results,setResults]=useState([])
  const [loading,setLoading]=useState(false)
  const theme=useTheme()
  const is480=useMediaQuery(theme.breakpoints.down("480"))
  const navigate=useNavigate()
  const {isDarkTheme}=useContext(ThemeContext)

  // 401 handled✅
  const handleSearchUser=async()=>{
    setLoading(true)
    try {
      const response=await fetch(`${BASE_URL}/searchuser`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({
          "userid":loggedInUser.userid,
          'query':query
        })
      })
      const result=await handleApiResponse(response)
      if(result.success){
        setResults(result.data)
      }
      else if(result.logout){
        setGlobalAlertOpen({state:true,message:result.message})
        LogoutUser()
        navigate("/login")
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
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
    if(query!==''){
      handleSearchUser()
    }
  },[query]) 

  const color=isDarkTheme?theme.palette.background.paper:theme.palette.common.black

  return (
    <>
    <Navbar/>
        <Leftbar/>
        <Stack flex={"1"} spacing={5}  justifyContent={'center'} alignItems={"center"} mt={2}>
              
              <Stack width={is480?"100%":'70%'} p={2}>

              
                <Stack>
                      <TextField placeholder='Search Users'  InputProps={{
        style: { color: color },
      }} sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: color, // Change this to the desired outline color
        },
        
      }}value={query} onChange={(e)=>setQuery(e.target.value.replace(/\s/g,''))} variant='outlined'></TextField>
                </Stack>

                <Stack spacing={5} height={"42rem"} sx={{overflowY:"scroll"}} justifyContent={'flex-start'} alignItems={"flex-start"} mt={5}>
                  <Typography>
                    {
                      query!==''?(
                        results.length>1?(`${results.length} matches found`):(`${results.length} match found`)
                      ):("")
                    
                    }
                    </Typography>
                {
                  loading?(
                    <Box><CircularProgress/></Box>
                  ):(
                    results.length!==0?
                    (
                  results.map((data)=>{
                    return <Stack key={data._id.$oid} direction={'row'} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Avatar component={Link} src={`${BUCKET_URL}/${data.profilePicture}`} to={`/profile/${data.username}`} sx={{"width":`${is480?"5rem":"10rem"}`,'height':`${is480?"5rem":"10rem"}`}}></Avatar>
                    <Stack>
                    <Typography component={Link} to={`/profile/${data.username}`} sx={{"textDecoration":"none",color:color}} variant='h6' fontWeight={300}>{data.username}</Typography>
                    <Stack direction={'row'} spacing={.1}>
                        <PlaceIcon sx={{color:"lightblue"}}/>
                        <Typography variant='body1' fontWeight={300}>{data.location}</Typography>
                    </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                  })):("")
                  )

                }

              </Stack>
              </Stack>
        </Stack>



        <Rightbar/>


        </>

  
  )
}
