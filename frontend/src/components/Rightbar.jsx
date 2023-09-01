import React, { useEffect, useState } from "react";
import {Avatar,Box,ImageList,ImageListItem,Typography,List,ListItem,ListItemAvatar,ListItemText,Divider, Stack, IconButton, CircularProgress, useMediaQuery} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { BASE_URL } from "../envVariables";
import { Link } from "react-router-dom";
import {useTheme} from "@mui/material";


export const Rightbar = () => {

  const theme=useTheme()
  const MD=useMediaQuery(theme.breakpoints.down("md"))
  const LG=useMediaQuery(theme.breakpoints.down("lg"))
  const SM=useMediaQuery(theme.breakpoints.down("sm"))

  const [loading,setLoading]=useState(false)
  const [suggestions,setSuggestions]=useState([])

  const handleRefreshSuggestions=async()=>{
    setLoading(true)
    try {

      const response=await fetch(`${BASE_URL}/randomusers`,{
        method:"GET"
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


  useEffect(()=>{
    handleRefreshSuggestions()
  },[])

  return (
    <Box p={2} flex={2} position={`${SM?("fixed"):("")}`} right={`${SM?("-20rem"):("")}`}>
      <Box p={2} position={'fixed'} bgcolor={'white'} display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
       
        {
          MD?(""):(
                      <Box>
            <Typography mt={LG?0:3} gutterBottom variant="h6" fontWeight={300}>
          LATEST PHOTOS
        </Typography>
        <ImageList cols={LG?2:3} variant="woven" sx={{"height":'20rem'}}>
          <ImageListItem>
            <img src="https://images.pexels.com/photos/461755/pexels-photo-461755.jpeg?auto=compress&cs=tinysrgb&w=1600" alt=""/>
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/40504255/pexels-photo-4050425.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/3755828/pexels-photo-3755828.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/6287534/pexels-photo-6287534.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/2155817/pexels-photo-2155817.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
          </ImageListItem>
        </ImageList>
          </Box>
          )
        }


            <Typography mt={3} gutterBottom variant="h6" fontWeight={300}>
          User Suggestions
          <IconButton onClick={handleRefreshSuggestions}>
            <RefreshIcon/>
        </IconButton>
        </Typography>
                  <List sx={{ width: "100%",maxWidth: 360,height:`${MD?("75vh"):'20rem'}`,overflowY:"scroll"}}>
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
