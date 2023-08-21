import React, { useContext, useEffect, useState } from 'react'
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton ,Typography,Checkbox, Stack, TextField,InputAdornment, Button} from "@mui/material";
import { ExpandMore ,MoreVert,Share,Favorite, CheckBox, FavoriteBorder, Comment,Send, HeartBroken} from "@mui/icons-material";
import { BASE_URL} from '../screens/Home';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

export const Postcard = ({username,caption,likesCount,imageUrl,unique_id,postedAt,profilePath,isLiked}) => {
  const [showComment,setShowComment]=useState({
    show:false,
    cardHeight:700
  })
  const [fetchedComment,setFetchedComment]=useState([])
  const [comment,setComment]=useState("")
  const toggleComments=()=>{
    setShowComment({show:!(showComment.show),cardHeight:showComment.show?(700):(1250)})
  }
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  useEffect(()=>{
    if(showComment.show){
      loadComment()
    }
  },[showComment.show])

  const loadComment=async()=>{
    setIsLoadingComments(true)
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
    finally{
      setIsLoadingComments(false)
    }
  }


  const handleSendComment=async()=>{
    try {
      const response=await fetch(`${BASE_URL}/postcomment`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          // 'userid':loggedInUser.userid,
          'postid':unique_id,
          'comment':comment,
          // 'username':loggedInUser.username
        })
      })

      const json=await response.json()

      if(response.ok){
        setFetchedComment((prevComments) => [...prevComments, json]);
        setComment("")
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
  
  const handlePostLike=async()=>{
    try {
      const response=await fetch(`${BASE_URL}/likepost`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          // 'userid':loggedInUser.userid,
          'postid':unique_id
        })
      })

      const json=await response.json()

      if(response.ok){
      }
      if(response.status==500){
        alert('internal server Error')
        console.log(response.json)
      }
    } catch (error) {
      alert(error)
    }


  }

  return (
    <Card sx={{margin:5,height:showComment.cardHeight}}>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: 'blue'}} aria-label="recipe" component={Link} to={`profile/${username}`} src={`${BASE_URL}/${profilePath}`}></Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      }
      title={<Typography component={Link} sx={{textDecoration:"none",color:"black"}} to={`profile/${username}`} variant='body2'>{username}</Typography>}
      subheader={postedAt}
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
        <Checkbox onClick={handlePostLike} icon={<FavoriteBorder/>} checked={isLiked} checkedIcon={<Favorite sx={{color:"red"}}/>}></Checkbox>
        <Typography variant='body1'>{likesCount}</Typography>
      </IconButton>
      {/* <IconButton aria-label="share">
        <Share />
      </IconButton> */}
      <IconButton onClick={toggleComments} aria-label="share">
        <Comment/>
      </IconButton>
    </CardActions>

      {/* COMMENTS section */}
    {
        showComment.show?(
          <CardContent sx={{bgcolor:"",height:"100%",padding:".5rem 1rem",overflowY:"scroll"}}>
            
            <Box bgcolor={''} sx={{overflowY:"scroll",height:"28rem",display:"flex",flexDirection:"column"}}>

                {
                  isLoadingComments?(<CircularProgress sx={{alignSelf:"center",justifySelf:"center",marginTop:4}}/>):(
                    fetchedComment.map((comment)=>{
                    return <Stack key={comment._id} mt={4} bgcolor={'white'} spacing={1}>
                  <Typography>{comment.username}</Typography>
                  <Stack bgcolor={''} direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                      <Typography  variant="body2" color="text.secondary">{comment.comment}</Typography>
                      <Stack>
                      <Checkbox icon={<FavoriteBorder fontSize='small' />} checkedIcon={<Favorite fontSize='small' sx={{color:"red"}}/>} />
                      </Stack>
                  </Stack>
                </Stack>
                  })
                  )
                }
                
            </Box>

            <Stack mt={4}>
            <TextField value={comment} onChange={(e)=>setComment(e.target.value)} label="Add a comment..." variant="standard" InputProps={{ endAdornment: (<InputAdornment position="end">{comment!==''?(<IconButton onClick={handleSendComment}><Send/></IconButton>):("")}</InputAdornment>),}}/>
            </Stack>
            
        </CardContent>
        ):("")
      }
    
  </Card>
  )
}
