import React, { useContext, useEffect, useState } from "react";
import {Avatar,Box,Card,CardActions,CardContent,CardHeader,CardMedia,IconButton,Typography,Checkbox,Stack,TextField,InputAdornment,Menu,MenuItem, useTheme, useMediaQuery,Button} from "@mui/material";
import {MoreVert,Favorite,FavoriteBorder,Comment,Send,Delete} from "@mui/icons-material";
import { BASE_URL} from "../screens/Home";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { loggedInUserContext } from "../context/user/Usercontext";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { postContext } from "../context/posts/PostContext";
import { GlobalAlertContext } from "../context/globalAlert/GlobalAlertContext";
import { BUCKET_URL, GIPHY_API_KEY, INTERNAL_SERVER_ERROR_MESSAGE, SERVER_DOWN_MESSAGE } from "../envVariables";
import { LogoutUser } from "../api/auth";
import { handleApiResponse, send_push_notification } from "../utils/common";
import nocommentsanimation from '../animations/nocommentsanimation.json'
import Lottie from "lottie-react";
import GifBoxIcon from '@mui/icons-material/GifBox';
import ReactGiphySearchbox from 'react-giphy-searchbox'
import { ThemeContext } from '../context/Theme/ThemeContext';



export const Postcard = ({username,caption,likesCount,imageUrl,unique_id,postedAt,profilePath,isLiked,setLikeModalOpen,userid,commentCount}) => {
  const [isLikedstate, setIsLikedState] = useState(isLiked);
  const theme=useTheme()
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const [likeCountState,setLikeCountState]=useState(likesCount)
  const {feed,setFeed}=useContext(postContext)
  const is480=useMediaQuery(theme.breakpoints.down("480"))
  const loggedInUser = useContext(loggedInUserContext);
  const [showComment, setShowComment] = useState({show: false,cardHeight: is480?(550):(700)});
  const [postingComment,setPostingComment]=useState(false)
  const [fetchedComment, setFetchedComment] = useState([]);
  const [comment, setComment] = useState('');
  const [giphyModalOpen,setGiphyModalOpen]=useState(false)
  const [selectedGif,setSelectedGif]=useState('')
  const [commentCountState,setCommentCountState]=useState(commentCount)
  const [commentLikes, setCommentLikes] = useState({});
  const MD=useMediaQuery(theme.breakpoints.down("md"))
  const SM=useMediaQuery(theme.breakpoints.down("sm"))
  const LG=useMediaQuery(theme.breakpoints.down("lg"))
  const is380=useMediaQuery(theme.breakpoints.down("380"))
  const navigate=useNavigate()
  const {isDarkTheme}=useContext(ThemeContext)

  const urlRegex = /(https?:\/\/[^\s]+)/;


  const toggleComments = (event) => {
    event.stopPropagation()
    setShowComment({
      show: !showComment.show,
      cardHeight: is480? (showComment.show ? 550 : 1105):(showComment.show ? 700 : 1255)
    });
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    if (showComment.show) {
      loadComment();
    }
  }, [showComment.show]);


  useEffect(() => {
    // Initialize commentLikes with the initial like status from props
    const initialLikes = {};
    fetchedComment.forEach((comment) => {
      initialLikes[comment._id.$oid] = comment.likes.includes(
        loggedInUser.loggedInUser.userid
      );
    });
    setCommentLikes(initialLikes);
  }, [fetchedComment, loggedInUser]);

  // 401 handled✅
  const loadComment = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`${BASE_URL}/getcomments`, {
        method: "POST",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postid: unique_id,
        }),
      });

      const result=await handleApiResponse(response)

      if (result.success){
        setFetchedComment(result.data);
      }
      else if(result.logout){
        navigate("/login")
        setGlobalAlertOpen({state:true,message:result.message})
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }
    } 
    catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    } finally {
      setIsLoadingComments(false);
    }
  };

  // 401 handled✅
  const handleSendComment = async (event,gifurl) => {
    if(event!=='None'){
      event.stopPropagation()
    }
    setPostingComment(true)
    try {
      const response = await fetch(`${BASE_URL}/postcomment`, {
        method: "POST",
        credentials:'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: loggedInUser.loggedInUser.userid,
          postid: unique_id,
          comment: gifurl?gifurl:comment,
          username: loggedInUser.loggedInUser.username,
          profilepath: loggedInUser.loggedInUser.profilePicture,
        }),
      });


      const result=await handleApiResponse(response)

      if(result.success){
        setPostingComment(false)
        setFetchedComment((prevComments) => [...prevComments, result.data.comment]);
        setComment("");
        setCommentCountState(result.data.updated_comment_count)

        if(result.data.fcmToken!==''){
          send_push_notification(result.data.fcmToken,'New Comment ✨',`${result.data.username} commented on your post`)
        }
      }
      else if(result.logout){
        setGlobalAlertOpen({state:true,message:result.message})
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
      setPostingComment(false)
      setSelectedGif('')
    }
  };

  // 401 handled✅
  const handlePostLike = async () => {
    try {
      const response = await fetch(`${BASE_URL}/likepost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({
          userid: loggedInUser.loggedInUser.userid,
          postid: unique_id,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setIsLikedState(json.message);
        setLikeCountState(json.updated_like_count)
        if(json.likeRequest && json.fcmToken!==''){
          send_push_notification(json.fcmToken,'Your post is being liked😎',`${json.username} liked your post`)
        }
      }
      if(response.status===401){
        LogoutUser()
        navigate("/login")
        setGlobalAlertOpen({state:true,message:json.message})
      }
      if(response.status===400){
        setGlobalAlertOpen({state:true,message:json.message})
      }

      if (response.status === 500) {
        console.log(json.message);
        setGlobalAlertOpen({state:true,message:INTERNAL_SERVER_ERROR_MESSAGE})
      }
    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
  };

  // 401 handled✅
  const handleCommentLike = async (commentid) => {
    try {
      const response = await fetch(`${BASE_URL}/commentlike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
        body: JSON.stringify({
          userid: loggedInUser.loggedInUser.userid,
          commentid: commentid,
        }),
      });

      const result=await handleApiResponse(response)

      if (result.success) {
        setFetchedComment((prevComments) =>
          prevComments.map((comment) => {
            if (comment._id.$oid === commentid) {
              // Check if the user has already liked the comment
              const userHasLiked = comment.likes.includes(loggedInUser.loggedInUser.userid);
      
              if (userHasLiked) {
                // User has liked the comment, so unlike it
                comment.likes.splice(comment.likes.indexOf(loggedInUser.loggedInUser.userid), 1);
                comment.likeCount--;
              } else {
                // User hasn't liked the comment, so like it
                comment.likes.push(loggedInUser.loggedInUser.userid);
                comment.likeCount++;
              }
            }
            return comment;
          })
        );
        
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
  };

  // 401 handled✅
  const handleDelete=async(e)=>{
    e.stopPropagation()
    try {
      const response=await fetch(`${BASE_URL}/deletepost`,{
        method:"POST",
        credentials:"include",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          'userid':loggedInUser.loggedInUser.userid,
          'postid':unique_id
        })
      })

      const json=await response.json()

      if(response.ok){
        setFeed(prevFeed => prevFeed.filter(post => post._id.$oid !== json.deletedPostId))
        setGlobalAlertOpen({state:true,message:'Post Deleted'})
      }

      if(response.status===400){
        setGlobalAlertOpen({state:true,message:json.message})
      }
      if(response.status===401){
        navigate("/login")
        setGlobalAlertOpen({state:true,message:json.message})
      }
      if(response.status===403){
        setGlobalAlertOpen({state:true,message:json.message})
      }

      if(response.status===500){
        console.log(json.message)
        setGlobalAlertOpen({state:true,message:INTERNAL_SERVER_ERROR_MESSAGE})
      }


    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteComment=async(e,commentId)=>{
    e.stopPropagation()
    try {
      const response=await fetch(`${BASE_URL}/deletecomment`,{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        credentials:"include",
        body:JSON.stringify({
          userid: loggedInUser.loggedInUser.userid,
          postid: unique_id,
          commentid:commentId
        })
      })

      const result=await handleApiResponse(response)

      if(result.success){
        setFetchedComment((comments) => comments.filter(comment => comment._id.$oid !== result.data.deleted_comment_id));
        setCommentCountState(result.data.updated_comment_count)
        setGlobalAlertOpen({state:true,message:'Comment Deleted'})
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
  }

  const color=isDarkTheme?theme.palette.common.white:''

  return (
    <Card sx={{position:"relative",margin:`${MD?("3rem"):"5rem"} 0rem`,height: showComment.cardHeight,width:`${is480?"100%":"80%"}`,bgcolor:`${isDarkTheme?theme.palette.primary.customBlack:theme.palette.background.paper}`}}>
      <CardHeader avatar={ <Avatar sx={{ bgcolor: "blue" }} aria-label="recipe" component={Link} to={`/profile/${username}`} src={`${BUCKET_URL}/${profilePath}`}></Avatar>}
        action={
          <Box> 
            <IconButton id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
          <MoreVert sx={{color:color}}/>
      </IconButton>
            {loggedInUser.loggedInUser.userid===userid?(
                <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
      >
        <MenuItem onClick={handleClose}>
          <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={1}>
            <Typography color={'red'} variant="body1">Delete</Typography>
            <IconButton onClick={(e)=>handleDelete(e)}>
                <Delete sx={{color:'red'}} />
            </IconButton>
          </Stack>
        </MenuItem>
      </Menu>
        ):("")}

      </Box>

        }
        title={
          <Typography
            component={Link}
            sx={{ textDecoration: "none", color: isDarkTheme?theme.palette.common.white:'black'}}
            to={`/profile/${username}`}
            variant="body2"

          >
            {username}
          </Typography>
        }
        subheader={<Typography variant="body2" color={isDarkTheme?theme.palette.common.white:theme.palette.text.secondary}>{postedAt}</Typography>}
      />

      <CardMedia image={imageUrl} component={imageUrl.toLowerCase().endsWith('.mp4')?("video"):("img")}  controls alt={`Unable to load ${username}s post`} style={{ height:`${is480?("350px"):("500px")}`,backgroundPosition:"center",objectFit:"contain"}}/>

      <CardContent>
        <Typography variant="body1" sx={{"overflowY":"scroll"}} color={color}>
          {caption}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
            
            <IconButton aria-label="add to favorites">
                <Checkbox onClick={handlePostLike} icon={<FavoriteBorder sx={{color:color}}/>} checked={isLikedstate} checkedIcon={<Favorite sx={{ color: 'red'}} />}></Checkbox>
                <Typography sx={{"cursor":"pointer",color:color}} onClick={()=>setLikeModalOpen({state:true,postid:unique_id,commentid:false})}>{likeCountState}</Typography>
            </IconButton>

            <IconButton onClick={(e)=>toggleComments(e)} aria-label="share">
              <Comment sx={{color:color}} />
              </IconButton>
              <Typography color={color}>{commentCountState}</Typography>

              {
                giphyModalOpen?(
              <Box sx={{position:"absolute",bottom:50,right:0,zIndex:400}}>
                  <ReactGiphySearchbox sx={{}} apiKey={GIPHY_API_KEY} 
                                onSelect={(item)=>{
                                  handleSendComment('None',item.images.original_mp4.mp4)
                                  }} 
                                  masonryConfig={[
                                    { columns: LG?2:3, imageWidth: is380?160:is480?180:200, gutter: 1 },
                                  ]}
                                />
              </Box>

                ):("")
              }


      </CardActions>

      {/* COMMENTS section */}
      {showComment.show ? (
        <CardContent sx={{height: "100%",padding: ".5rem 1rem",overflowY: "scroll",}}>
          <Box  sx={{ overflowY: "scroll", height: "28rem", display: "flex",flexDirection: "column",}}>

            {
            isLoadingComments?
            (
              <CircularProgress sx={{ alignSelf: "center",justifySelf: "center",marginTop: 4}}/>
            ):
            fetchedComment.length == 0?
            (
              <Stack mt={4} sx={{ alignSelf: "center", justifySelf: "center" }} justifyContent={'center'} alignItems={'center'}>
                <Box height={'10rem'} width={'10rem'}>
                  <Lottie animationData={nocommentsanimation}></Lottie>
                </Box>
                <Typography color={color}>
                  hi {loggedInUser.loggedInUser.username}✨ we were just practicing
                </Typography>
                <Typography color={color}>there are no comments</Typography>
              </Stack>
            ):(
              fetchedComment.map((comment) => {
                return (
                    <Stack key={comment._id.$oid} mt={4} spacing={1} p={'0 1rem'}>

                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
                              <Avatar alt={comment.username} src={`${BUCKET_URL}/${comment.profilepath}`} component={Link} to={`/profile/${comment.username}`}/>
                              <Typography sx={{"textDecoration":"none",color:isDarkTheme?theme.palette.common.white:'black'}} component={Link} to={`/profile/${comment.username}`}>{comment.user_id===loggedInUser.loggedInUser.userid?'You':comment.username}</Typography>
                              {
                                comment.user_id===loggedInUser.loggedInUser.userid?(
                                      <IconButton onClick={(e)=>handleDeleteComment(e,comment._id.$oid)}><Delete sx={{color:color}} fontSize="small"/></IconButton>
                                ):("")
                              } 
                        </Stack>

                        <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"}>
                        
                        {
                          urlRegex.test(comment.comment)?(
                            <video height={is480?100:SM?150:LG?200:250} autoPlay loop src={comment.comment} alt={`${comment.username}s sent gif`} />
                          ):(
                            <Typography variant="body2" color={color}>{comment.comment}</Typography>

                          )
                        }
                        <Stack direction={"row"} alignItems={"center"}>
                                <Checkbox checked={comment.likes.includes(loggedInUser.loggedInUser.userid)} onClick={()=>handleCommentLike(comment._id.$oid)} icon={<FavoriteBorder sx={{color:color}} fontSize="small"/>} checkedIcon={<Favorite fontSize="small" sx={{ color: "red" }} />}/>
                                <Typography sx={{"cursor":"pointer",color:color}} onClick={()=>setLikeModalOpen({state:true,postid:false,commentid:comment._id.$oid})} variant="body2">{comment.likeCount}</Typography>        
                        </Stack>
                    </Stack>

                  </Stack>
                );
              })

            )}
          </Box>

          <Stack mt={4}>
            <TextField  value={comment} onKeyDown={(e) => {
              if (e.key === 'Enter' && comment.trim() !== ''){
              handleSendComment(e)
            }}} 
                      onChange={(e) => setComment(e.target.value)} sx={{
                        '& label.Mui-focused': { color }, // Change the label color when focused
                        '& .MuiOutlinedInput-root': {
                          '&.Mui-focused fieldset': { borderColor: color }, // Change the outline color when focused
                        },
                      }} InputLabelProps={{style:{color}}} label="Add a comment..." variant="standard" InputProps={{style:{color},endAdornment: (<InputAdornment position="end"><IconButton onClick={(e)=>{
                        e.stopPropagation()
                        setGiphyModalOpen(!giphyModalOpen)}}><GifBoxIcon sx={{color:'lightblue'}} fontSize="large"/></IconButton>
                    {comment.trim()!==''? (
                      postingComment?(
                        <LoadingButton
                          loadingPosition="center"
                          disabled={false}
                          loading={true}
                          variant="text"
                        ></LoadingButton>
                      ):(
                        <IconButton variant="text">
                          <Send sx={{color:color}} onClick={(e)=>handleSendComment(e)}/>
                        </IconButton>
                      )
                    ) : (
                      ""
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </CardContent>
      ) : (
        ""
      )}
    </Card>
  );
};
