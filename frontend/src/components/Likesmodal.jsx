import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useEffect, useState } from 'react';
import { Avatar, CircularProgress, Stack } from '@mui/material';
import { BASE_URL } from '../screens/Home';
import { getPostLikes } from '../api/post';
import { Link } from 'react-router-dom';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY:"scroll"
};

export const Likesmodal=({open,handleClose,postid})=> {

  const [likesData,setLikesData]=useState([])
  const [loading,setLoading]=useState(false)

  const fetchPostLike=async()=>{
    setLoading(true)
    try {
      const data=await getPostLikes(postid)
      setLikesData(data)
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }

  }

  useEffect(()=>{
    if(open){
      fetchPostLike()
    }
    else{
      setLikesData([])
    }
  },[open])

  return (
      <Modal  open={open} onClose={handleClose}>
        <Stack sx={style} height={'30rem'} spacing={4}>

          <Typography id="modal-modal-title" variant="h6" fontWeight={300}>
            See who liked the post
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
          <Avatar alt="Cindy Baker" src={`${BASE_URL}/${data.profilePicture}`} component={Link} to={`/profile/${data.username}`}/>
          <Typography component={Link} sx={{ textDecoration: "none", color: "black" }} to={`/profile/${data.username}`} variant='h6' fontWeight={300}>{data.username}</Typography>
        </Stack>
        <Button size='small' variant='contained'>follow</Button>
      </Stack>
    ))
  )}
          </Stack>

        </Stack>
      </Modal>
  );
}