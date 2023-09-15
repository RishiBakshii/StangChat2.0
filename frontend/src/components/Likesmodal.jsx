import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useContext, useEffect, useState } from 'react';
import { Avatar, CircularProgress, Stack, useMediaQuery, useTheme } from '@mui/material';
import { BASE_URL } from '../screens/Home';
import { getCommentLikes, getPostLikes } from '../api/post';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';
import { BUCKET_URL } from '../envVariables';





export const Likesmodal=({open,handleClose,postid,commentid})=> {
  const navigate=useNavigate()
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const [likesData,setLikesData]=useState([])
  const [loading,setLoading]=useState(false)

  const theme=useTheme()

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY:"scroll",
    [theme.breakpoints.down("480")]:{
      width:"18rem"
    }
  };


  const fetchPostLike=async()=>{
    setLoading(true)
    try {
      const result=await getPostLikes(postid)
      if(result.success){
        setLikesData(result.data)
      }
      else if(result.logout){
        navigate("/login")
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }

  }


  const fetchCommentLike=async()=>{
    setLoading(true)
    try {
      const result=await getCommentLikes(commentid)
      if(result.success){
        setLikesData(result.data)
      }
      else if(result.logout){
        navigate("/login")
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(open && postid){
      fetchPostLike()
    }
    else if(open && commentid){
      fetchCommentLike()
    }
    else{
      setLikesData([])
    }
  },[open])

  return (
      <Modal  open={open} onClose={handleClose}>
        <Stack sx={style} height={'27rem'} spacing={4}>

          <Typography id="modal-modal-title" variant="h6" fontWeight={300}>
            See who liked the {`${postid?"post":('comment')}`}
          </Typography>

          <Stack spacing={3}>
          {loading ? (
    <CircularProgress sx={{ alignSelf: 'center', justifySelf: "center" }} />
  ) : likesData.length === 0 ? (
    <Typography  variant='body1'>There are no likes yet😓</Typography>
  ) : (
    likesData.map((data) => (
      <Stack direction={'row'} justifyContent={'space-between'} key={data.id}>
        <Stack direction={'row'} spacing={2}>
          <Avatar alt="Cindy Baker" src={`${BUCKET_URL}/${data.profilePicture}`} component={Link} to={`/profile/${data.username}`}/>
          <Typography component={Link} sx={{ textDecoration: "none", color: "black" }} to={`/profile/${data.username}`} variant='h6' fontWeight={300}>{data.username}</Typography>
        </Stack>
      </Stack>
    ))
  )}
          </Stack>

        </Stack>
      </Modal>
  );
}