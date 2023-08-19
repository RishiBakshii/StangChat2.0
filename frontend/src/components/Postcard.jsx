import React, { useState } from 'react'
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton ,Typography,Checkbox, Stack} from "@mui/material";
import { ExpandMore ,MoreVert,Share,Favorite, CheckBox, FavoriteBorder, Comment} from "@mui/icons-material";


export const Postcard = ({username,caption,likes,profilePicture,imageUrl}) => {

  const [showComment,setShowComment]=useState({
    show:false,
    cardHeight:700
  })

  const toggleComments=()=>{
    setShowComment({show:!showComment.show,cardHeight:showComment.show?(1200):(700)})
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
      style={{height:'70%',objectFit: 'contain' }}
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
    {
        showComment.show?(
          <Stack bgcolor={'red'} height={200}>
            comment box
          </Stack>
        ):("")
      }
    
  </Card>
  )
}
