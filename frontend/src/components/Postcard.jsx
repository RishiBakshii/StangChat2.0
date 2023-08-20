import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton ,Typography,Checkbox, Stack, TextField,InputAdornment} from "@mui/material";
import { ExpandMore ,MoreVert,Share,Favorite, CheckBox, FavoriteBorder, Comment,Send} from "@mui/icons-material";
import { BASE_URL, userInformation } from '../screens/Home';
import CircularProgress from '@mui/material/CircularProgress';

export const Postcard = ({username,caption,likes,profilePicture,imageUrl,unique_id}) => {

  const loggedInUser=useContext(userInformation);
  const [showComment,setShowComment]=useState({
    show:false,
    cardHeight:700
  })
  const [fetchedComment,setFetchedComment]=useState([])
  const [comment,setComment]=useState("")
  const toggleComments=()=>{
    setShowComment({show:!(showComment.show),cardHeight:showComment.show?(700):(1250)})
  }

  const loadComment=async()=>{
    try {
      const response=await fetch(`${BASE_URL}/getcomments`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          'postid':unique_id,
        })
      })

      const json=await response.json()
      if(response.ok){
        setFetchedComment(json)
        console.log(json)
      }
      if(response.status==500){
        alert('interal server error')
        console.log(json.message)
      }
    } catch (error) {
      alert(error)
    }
  }

  useEffect(()=>{
    if(showComment.show){
      loadComment()
    }
  },[showComment.show])

  const handleSendComment=async()=>{
    try {
      const response=await fetch(`${BASE_URL}/postcomment`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          'userid':loggedInUser.userid,
          'postid':unique_id,
          'comment':comment,
          'username':loggedInUser.username
        })
      })

      const json=await response.json()

      if(response.ok){
        console.log(json)
        setFetchedComment((prevComments) => [...prevComments, json]);
      }
      if(response.status==500){
        alert("internal server error")
        console.log(json.message)
      }
      if(response.status==400){
        alert(json.message)
      }


    } catch (error) {
      alert(error)
    }
}

  return (
    <Card sx={{margin:5,height:showComment.cardHeight}}>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: 'blue' }} aria-label="recipe" src={profilePicture}></Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      }
      title={username}
      subheader="September 14, 2016"
    />

    <CardMedia
      component="img"
      image={imageUrl}
      alt={`Unable to load ${username}s post`}
      style={{height:'500px',objectFit: 'contain' }}
    />

    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {caption}
      </Typography>
    </CardContent>

    <CardActions disableSpacing>
      <IconButton aria-label="add to favorites">
        <Checkbox icon={<FavoriteBorder/>} checkedIcon={<Favorite/>}></Checkbox>
      </IconButton>{likes}
      <IconButton aria-label="share">
        <Share />
      </IconButton>
      <IconButton onClick={toggleComments} aria-label="share">
        <Comment/>
      </IconButton>
    </CardActions>

      {/* comments section */}
    {
        showComment.show?(
          <CardContent sx={{bgcolor:"",height:"100%",padding:".5rem 1rem",overflowY:"scroll"}}>

            <Box bgcolor={''} sx={{overflowY:"scroll",height:"28rem"}}>

                {
                  fetchedComment.map((comment)=>{
                    return <Stack key={comment._id} mt={4} bgcolor={'white'} spacing={1}>
                  <Typography>{comment.username}</Typography>
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'center'}>
                  <Typography  variant="body2" color="text.secondary">{comment.comment}</Typography>
                  <Checkbox icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
                  </Stack>
                </Stack>

                  })
                }
                
            </Box>

            <Stack mt={4}>
            <TextField value={comment} onChange={(e)=>setComment(e.target.value)} label="Add a comment..." variant="standard" InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleSendComment}>{comment!==''?(<Send />):("")}</IconButton></InputAdornment>),}}/>
            </Stack>
            
        </CardContent>
        ):("")
      }
    
  </Card>
  )
}
