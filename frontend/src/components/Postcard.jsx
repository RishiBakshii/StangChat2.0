import React, { useContext, useEffect, useState } from "react";
import {Avatar,Box,Card,CardActions,CardContent,CardHeader,CardMedia,IconButton,Typography,Checkbox,Stack,TextField,InputAdornment,Menu,MenuItem, useTheme, useMediaQuery,} from "@mui/material";
import {MoreVert,Favorite,FavoriteBorder,Comment,Send,Delete} from "@mui/icons-material";
import { BASE_URL} from "../screens/Home";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, useNavigate } from "react-router-dom";
import { loggedInUserContext } from "../context/user/Usercontext";
import LoadingButton from "@mui/lab/LoadingButton/LoadingButton";
import { postContext } from "../context/posts/PostContext";
import { GlobalAlertContext } from "../context/globalAlert/GlobalAlertContext";
import { INTERNAL_SERVER_ERROR_MESSAGE, SERVER_DOWN_MESSAGE } from "../envVariables";
import { LogoutUser } from "../api/auth";

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
  const [comment, setComment] = useState([]);
  const [commentLikes, setCommentLikes] = useState({});
  const MD=useMediaQuery(theme.breakpoints.down("md"))
  const navigate=useNavigate()


  const toggleComments = () => {
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


  const loadComment = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`${BASE_URL}/getcomments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postid: unique_id,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setFetchedComment(json);

        const initialCommentLikes={}
        
        json.forEach((comment) => {
          const commentIdAsString=String(comment._id.$oid)
          initialCommentLikes[commentIdAsString] = {
            "liked": comment.likes.includes(loggedInUser.loggedInUser.userid),
            "likeCount":comment.likeCount
          };
        });

        setCommentLikes(initialCommentLikes)
        console.log(commentLikes)
      }
      if (response.status == 500) {
        alert("interal server error");
        console.log(json.message);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoadingComments(false);
    }
  };
  const handleSendComment = async () => {
    setPostingComment(true)
    try {
      const response = await fetch(`${BASE_URL}/postcomment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: loggedInUser.loggedInUser.userid,
          postid: unique_id,
          comment: comment,
          username: loggedInUser.loggedInUser.username,
          profilepath: loggedInUser.loggedInUser.profilePicture,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        setPostingComment(false)
        setFetchedComment((prevComments) => [...prevComments, json]);
        setComment("");
      }
      if (response.status == 500) {
        alert("internal server error");
        console.log(json.message);
      }
      if (response.status == 400) {
        alert(json.message);
      }
    } catch (error) {
      alert(error);
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
  const handleCommentLike = async (commentid) => {
    try {
      const response = await fetch(`${BASE_URL}/commentlike`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: loggedInUser.loggedInUser.userid,
          commentid: commentid,
        }),
      });

      const json = await response.json();

      if (response.ok) {

        console.log("before updating the state",commentLikes)

        setCommentLikes((prevCommentLikes) => {
          const newCommentLikes = { ...prevCommentLikes };
        
          newCommentLikes[commentid] = {
            "liked": json.message,
            "likeCount": json.updated_like_count
          };
        
          console.log("After updating state:", newCommentLikes);
          return newCommentLikes;
        });
        
      }
      if (response.status == 500) {
        alert("interal server error");
      }
      if (response.status == 400) {
        alert("someething went wront");
      }
    } catch (error) {
      alert(error);
    }
  };

  // 401 handled✅
  const handleDelete=async()=>{
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

  return (
    <Card sx={{margin:`${MD?("3rem"):"5rem"} 0rem`,height: showComment.cardHeight,width:`${is480?"95%":"80%"}`}}>
      <CardHeader avatar={ <Avatar sx={{ bgcolor: "blue" }} aria-label="recipe" component={Link} to={`/profile/${username}`} src={`${BASE_URL}/${profilePath}`}></Avatar>}
        action={
          <Box> 
            <IconButton id="basic-button" aria-controls={open ? 'basic-menu' : undefined} aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
          <MoreVert/>
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
            <IconButton onClick={handleDelete}>
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
            sx={{ textDecoration: "none", color: "black" }}
            to={`/profile/${username}`}
            variant="body2"
          >
            {username}
          </Typography>
        }
        subheader={postedAt}
      />

      <CardMedia component={imageUrl.toLowerCase().endsWith('.mp4')?("video"):("img")} image={imageUrl} controls alt={`Unable to load ${username}s post`} style={{ height:`${is480?("350px"):("500px")}`,objectFit: "contain" }}/>

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {caption}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
            
            <IconButton aria-label="add to favorites">
                <Checkbox onClick={handlePostLike} icon={<FavoriteBorder />} checked={isLikedstate} checkedIcon={<Favorite sx={{ color: "red" }} />}></Checkbox>
                <Typography sx={{"cursor":"pointer"}} onClick={()=>setLikeModalOpen({state:true,postid:unique_id})}>{likeCountState}</Typography>
            </IconButton>

            <IconButton onClick={toggleComments} aria-label="share">
              <Comment />
              </IconButton>
              <Typography>{commentCount}</Typography>

      </CardActions>

      {/* COMMENTS section */}
      {showComment.show ? (
        <CardContent sx={{bgcolor: "",height: "100%",padding: ".5rem 1rem",overflowY: "scroll",}}>
          <Box bgcolor={""} sx={{ overflowY: "scroll", height: "28rem", display: "flex",flexDirection: "column",}}>

            {
            isLoadingComments?
            (
              <CircularProgress sx={{ alignSelf: "center",justifySelf: "center",marginTop: 4}}/>
            ):
            fetchedComment.length == 0?
            (
              <Stack mt={4} sx={{ alignSelf: "center", justifySelf: "center" }}>
                There are no comments☹️
              </Stack>
            ):(
              fetchedComment.map((comment) => {
                return (
                    <Stack key={comment._id.$oid} mt={4} bgcolor={"white"} spacing={1} p={'0 1rem'}>

                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
                              <Avatar alt={comment.username} src={`${BASE_URL}/${comment.profilepath}`} component={Link} to={`/profile/${comment.username}`}/>
                              <Typography sx={{"textDecoration":"none",color:"black"}} component={Link} to={`/profile/${comment.username}`}>{comment.username}</Typography>
                        </Stack>

                        <Stack bgcolor={""} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>

                        <Typography variant="body2" color="text.primary">{comment.comment}</Typography>

                        <Stack direction={"row"} alignItems={"center"}>
                                <Checkbox checked={commentLikes[comment._id.$oid].liked} onClick={() => handleCommentLike(comment._id.$oid)} icon={<FavoriteBorder fontSize="small"/>} checkedIcon={<Favorite fontSize="small" sx={{ color: "red" }} />}/>
                                <Typography variant="body2">{commentLikes[comment._id.$oid]?commentLikes[comment._id.$oid].liked:comment.likes.includes(loggedInUser.loggedInUser.userid)}</Typography>
                                {commentLikes[comment._id.$oid].liked}        
                        </Stack>
                    </Stack>

                  </Stack>
                );
              })

            )}
          </Box>

          <Stack mt={4}>
            <TextField value={comment} onChange={(e) => setComment(e.target.value)} label="Add a comment..." variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {comment !== "" ? (
                      postingComment?(
                        <LoadingButton
                          loadingPosition="center"
                          disabled={false}
                          loading={true}
                          variant="text"
                        ></LoadingButton>
                      ):(
                        <IconButton onClick={handleSendComment}>
                          <Send />
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
