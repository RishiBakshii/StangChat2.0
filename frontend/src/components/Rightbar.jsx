import React, { useEffect, useState } from "react";
import {Avatar,Box,ImageList,ImageListItem,Typography,List,ListItem,ListItemAvatar,ListItemText,Divider, Stack, IconButton, CircularProgress,} from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import { BASE_URL } from "../envVariables";
import { Link } from "react-router-dom";

export const Rightbar = () => {
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
    <Box p={2} flex={2} sx={{ display: { xs: "none", sm: "block" } }}>
      <Box p={2} position={"fixed"} display={"flex"} flexDirection={"column"} alignItems={"flex-start"}
      >
        {/* <Typography variant="h6" fontWeight={100}>
          Online Friends
        </Typography> */}
        {/* <AvatarGroup max={7}>
          <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
          <Avatar alt="Trevor Henderson" src="/static/images/avatar/5.jpg" />
        </AvatarGroup> */}
        <Typography mt={3} gutterBottom variant="h6" fontWeight={100}>
          LATEST PHOTOS
        </Typography>
        <ImageList cols={3} rowHeight={100} sx={{"height":'20rem'}}>
          <ImageListItem>
            <img src="https://images.pexels.com/photos/461755/pexels-photo-461755.jpeg?auto=compress&cs=tinysrgb&w=1600" alt=""/>
          </ImageListItem>
          <ImageListItem>
            <img
              src="https://images.pexels.com/photos/4050425/pexels-photo-4050425.jpeg?auto=compress&cs=tinysrgb&w=1600"
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

        

        <Typography mt={3} gutterBottom variant="h6" fontWeight={100}>
          User Sugeestions
          <IconButton onClick={handleRefreshSuggestions}>
            <RefreshIcon/>
        </IconButton>
        </Typography>


        <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" ,height:"40rem"}}>

              {
                loading?(<CircularProgress/>):(
                  suggestions.length!==0?(
                    suggestions.map((data)=>{
                      return               <ListItem alignItems="flex-start">
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
