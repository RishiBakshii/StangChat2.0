import React, { useContext, useEffect, useState } from "react";
import {Avatar,Box,ImageList,ImageListItem,Typography,List,ListItem,ListItemAvatar,ListItemText,Divider, Stack, IconButton, CircularProgress, useMediaQuery} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { BASE_URL } from "../envVariables";
import { Link } from "react-router-dom";
import {useTheme} from "@mui/material";
import { rightBarContext } from "../context/rigthbar/RightbarContext";
import { loggedInUserContext } from "../context/user/Usercontext";


export const Rightbar = () => {
  const {loggedInUser}=useContext(loggedInUserContext)
  const {rightBarOpen,setRightBarOpen}=useContext(rightBarContext)
  const theme=useTheme()
  const MD=useMediaQuery(theme.breakpoints.down("md"))
  const LG=useMediaQuery(theme.breakpoints.down("lg"))
  const SM=useMediaQuery(theme.breakpoints.down("sm"))
  const is345=useMediaQuery(theme.breakpoints.down('345'))

  const [loading,setLoading]=useState(false)
  const [suggestions,setSuggestions]=useState([])

  const [latestPost,setLatestPost]=useState([])
  const [postLoader,setPostLoader]=useState(false)

  const handleRefreshSuggestions=async()=>{
    setLoading(true)
    try {

      const response=await fetch(`${BASE_URL}/randomusers`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          'userid':loggedInUser.userid
        })
      })

      const json=await response.json()

      if(response.ok){
        setSuggestions(json)
        console.log(json)
      }
      if(response.status===500){
        alert("internal server error")
      }
      if(response.status==400){
        alert("status 400")
      }
    } catch (error) {
      alert("error")
    }
    finally{
      setLoading(false)
    }
  }

  const fetchLatestPost=async()=>{
    setPostLoader(true)
    try {
      const response=await fetch(`${BASE_URL}/getlatestposts`,{method:"GET"})

      const json=await response.json()

      if(response.ok){
        setLatestPost(json)
      }

      if(response.status===500){
        alert("internal server error")
      }

    } catch (error) {
      alert(error)
    }
    finally{
      setPostLoader(false)
    }
  }

  useEffect(()=>{
    fetchLatestPost()
  },[])

  useEffect(()=>{
    handleRefreshSuggestions()
  },[loggedInUser])

  return (
    <Box p={2} sx={{"transition":".2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"}} flex={2} position={`${SM?("fixed"):("")}`} right={`${SM?(rightBarOpen?('97vw'):('-20rem')):("")}`}>
        <Box p={2} position={'fixed'} display={"flex"} bgcolor={'white'} flexDirection={"column"} alignItems={"flex-start"}>
       
          <Box>
            <Typography mt={LG?0:3} gutterBottom variant="h6" fontWeight={300}>
                LATEST PHOTOS
            </Typography>

            <ImageList cols={LG?2:3} variant="woven" sx={{"height":'20rem'}}>
              {
                postLoader?(<CircularProgress/>):(
                  latestPost.length!==0?(
                    latestPost.map((data)=>{
                      return <ImageListItem component={Link} to={`/profile/${data.username}`}> <img src={`${BASE_URL}/${data.postPath}`} alt=""/></ImageListItem>
                    })
                  ):("")
                )
              }
        
            </ImageList>

          </Box>


          <Typography mt={3} gutterBottom variant="h6" fontWeight={300}>
            User Suggestions
          <IconButton onClick={handleRefreshSuggestions}><RefreshIcon/></IconButton>
          </Typography>
                  <List  sx={{width: "100%",height:`${MD?("75vh"):'20rem'}`,overflowY:"scroll"}}>
              {
                loading?(<CircularProgress/>):(
                  suggestions.length!==0?(
                    suggestions.map((data)=>{
                      return  <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={data.username} component={Link} to={`/profile/${data.username}`} src={`${BASE_URL}/${data.profilePicture}`} />
            </ListItemAvatar>
            <ListItemText component={Link} to={`/profile/${data.username}`} primary={data.username}
              secondary={
                <React.Fragment>
                  <Typography sx={{ display: "inline" }} component="span"variant="body2" color="text.primary">
                    {data.location}
                  </Typography>
                  {`- ${data.bio}`}
                </React.Fragment>
              }
            />
          </ListItem>
                    })
                  ):("")
                )
              }

          <Divider variant="inset" component="li" />
        </List>
      </Box>
    </Box>
  );
};
