import React, { useContext, useEffect, useState } from "react";
import {Avatar,Box,ImageList,ImageListItem,Typography,List,ListItem,ListItemAvatar,ListItemText,Divider,IconButton, CircularProgress, useMediaQuery} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { BASE_URL, BUCKET_URL, SERVER_DOWN_MESSAGE } from "../envVariables";
import { Link, useNavigate } from "react-router-dom";
import {useTheme} from "@mui/material";
import { rightBarContext } from "../context/rigthbar/RightbarContext";
import { loggedInUserContext } from "../context/user/Usercontext";
import { handleApiResponse } from "../utils/common";
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';
import { GlobalAlertContext } from "../context/globalAlert/GlobalAlertContext";



export const Rightbar = ({dms}) => {
  const {loggedInUser}=useContext(loggedInUserContext)
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const {rightBarOpen}=useContext(rightBarContext)
  const theme=useTheme()
  const MD=useMediaQuery(theme.breakpoints.down("md"))
  const LG=useMediaQuery(theme.breakpoints.down("lg"))
  const SM=useMediaQuery(theme.breakpoints.down("sm"))
  const is480=useMediaQuery(theme.breakpoints.down("480"))
  const is450=useMediaQuery(theme.breakpoints.down("450"))

  const [loading,setLoading]=useState(false)
  const [suggestions,setSuggestions]=useState([])

  const [latestPost,setLatestPost]=useState([])
  const [postLoader,setPostLoader]=useState(false)
  const {isDarkTheme}=useContext(ThemeContext)


  const navigate=useNavigate()

  // 401 handled ✅
  const handleRefreshSuggestions=async()=>{
    setLoading(true)
    try {

      const response=await fetch(`${BASE_URL}/randomusers`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        credentials:"include",
        body:JSON.stringify({
          'userid':loggedInUser.userid
        })
      })

      const result=await handleApiResponse(response)

      if(result.success){
        setSuggestions(result.data)
      }
      else if(result.logout){
        navigate("/login")
        setGlobalAlertOpen({state:true,message:result.message})
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

  const fetchLatestPost=async()=>{
    setPostLoader(true)
    try {
      const response=await fetch(`${BASE_URL}/getlatestposts`,{method:"GET"})

      const json=await response.json()

      if(response.ok){
        setLatestPost(json)
      }

      if(response.status===500){
        console.log(json.message)
      }

    } catch (error) {
      console.log(error)
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

  const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black

  return (
    <Box p={2} sx={{"transition":".2s cubic-bezier(0.25, 0.46, 0.45, 0.94)"}} flex={2} color={color}  position={`${SM?("fixed"):("")}`} right={`${SM?(rightBarOpen?('97vw'):('-20rem')):("")}`}>
        <Box p={2} position={'fixed'}  bgcolor={isDarkTheme?theme.palette.primary.customBlack:theme.palette.background.paper} display={"flex"} flexDirection={"column"} zIndex={1000} alignItems={"flex-start"}>

          {/* {
            is480?(""):(
                     <Box>
            <Typography mt={LG?0:3} gutterBottom variant="h6" fontWeight={300}>
                LATEST POST
            </Typography>

            <ImageList cols={LG?2:3} variant="quilted" sx={{"height":'20rem'}}>
              {
                postLoader?(<CircularProgress/>):(
                  latestPost.length!==0?(
                    latestPost.map((data)=>{
                      return <ImageListItem component={Link} to={`/profile/${data.username}`}>
                        {
                        data.postPath.toLowerCase().endsWith('.mp4')?(
                          <video src={`${BUCKET_URL}/${data.postPath}`} controls></video>
                        ):(
                          <img src={`${BUCKET_URL}/${data.postPath}`} alt={data.username} />
                        )
                        }
                        </ImageListItem>
                    })
                  ):("")
                )
              }
        
            </ImageList>

          </Box>
            )
          } */}
   


          <Typography mt={3} gutterBottom variant="h6" fontWeight={300}>
            User Suggestions
          <IconButton onClick={handleRefreshSuggestions}><RefreshIcon sx={{color:isDarkTheme?theme.palette.common.white:""}}/></IconButton>
          </Typography>

                  <List  sx={{width: "100vw",height:`${is480?'75vh':MD?("20rem"):'40rem'}`,overflowY:"scroll",paddingTop:"1rem",paddingBottom:"1rem"}}>
              {
                loading?(<CircularProgress/>):(
                  suggestions.length!==0?(
                    suggestions.map((data)=>{
                      return  <ListItem key={data.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={data.username} component={Link} to={`/profile/${data.username}`} src={`${BUCKET_URL}/${data.profilePicture}`}/>
            </ListItemAvatar>
            <ListItemText component={Link} to={`/profile/${data.username}`} primary={data.username}
              secondary={
                <>
                  <Typography sx={{ display: "inline",color:color}} component="span"variant="body2" >
                    {data.location}
                  {`- ${data.bio.split(" ").splice(0,7).join(" ")}`}
                  </Typography>
                </>
              }
            />
          </ListItem>
                    })
                  ):("")
                )
              }

          {/* <Divider variant="inset" component="li" /> */}
        </List>
      </Box>
    </Box>
  );
};
