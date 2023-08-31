import React, { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import { Rightbar } from '../components/Rightbar'
import { LocationCityRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../envVariables'
import { loggedInUserContext } from '../context/user/Usercontext'


export const Search = () => {
  const {loggedInUser}=useContext(loggedInUserContext)
  const [query,setQuery]=useState('')
  const [results,setResults]=useState([])
  const [loading,setLoading]=useState(false)


  const handleSearchUser=async()=>{
    setLoading(true)
    try {
      const response=await fetch(`${BASE_URL}/searchuser`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          "userid":loggedInUser.userid,
          'query':query
        })
      })
      
      const json=await response.json()
      if(response.ok){setResults(json)}
      if(response.status===500){alert("internal server error")}
      if(response.status===400){alert("status 400")}
    } catch (error) {
      alert("frontend error")
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

  return (
    <>
    <Navbar/>
    <Stack direction={"row"} spacing={2}>
        <Leftbar/>
        <Stack flex={4} p={2} justifyContent={'flex-start'} alignItems={'flex-start'} >

                <Stack >
                      <TextField sx={{width:"40vw"}} placeholder='Search Users' value={query} onChange={(e)=>setQuery(e.target.value)} variant='outlined'></TextField>
                </Stack>

                <Stack spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>
                  <Typography>{results.length} matches found</Typography>
                {
                  loading?(
                    <Box>
                      <CircularProgress/>
                    </Box>
                  ):(
                    results.length!==0?(
                  results.map((data)=>{
                    return <Stack key={data._id.$oid} direction={'row'} alignSelf={'center'} width={"40rem"} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Avatar component={Link} src={`${BASE_URL}/${data.profilePicture}`} to={`/profile/${data.username}`} sx={{"width":"10rem",'height':"10rem"}}></Avatar>
                    <Stack>
                    <Typography component={Link} to={`/profile/${data.username}`} sx={{"textDecoration":"none",color:"black"}} variant='h5' fontWeight={300}>{data.username}</Typography>
                    <Typography variant='body1' fontWeight={300}>{data.location}</Typography>
                    </Stack>
                  </Stack>
                  <Stack justifyContent={'center'}>

                   <Button variant='contained'>Follow</Button>
                  </Stack>
                </Stack>
                
                  })
                
                    ):(<Typography variant='h5'>no search results</Typography>)
                  )

                }

              </Stack>

         </Stack>
    </Stack>  
        </>

  
  )
}
