import {Button,Typography,Modal,Stack,TextField,styled} from '@mui/material';
import { useContext, useState } from 'react';
import { feedUpdate} from '../screens/Home';
import { loggedInUserContext } from '../context/user/Usercontext';
import LoadingButton from '@mui/lab/LoadingButton';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius:".4rem"
};

const CustomPhotoinput=styled('input')({
    height:"100%",
    width:"100%",
    cursor:"pointer",
    zIndex:1,
    opacity:0,
    position:"absolute"
})

const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const PostModal=({ isOpen, onClose})=> {
    const loggedInUser=useContext(loggedInUserContext)
    const updateFeed=useContext(feedUpdate)
    const [selectedImage, setSelectedImage] = useState(null);
    const [displayImage,setDisplayImage]=useState(null)
    const [caption,setCaption]=useState('')
    const [loading,setLoading]=useState(false)
    const defaultImage="https://t4.ftcdn.net/jpg/04/99/93/31/240_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
          setSelectedImage(imageFile)
          console.log(selectedImage)
    
          const imageUrl = URL.createObjectURL(imageFile);
          setDisplayImage(imageUrl);
          console.log(imageUrl)
        }
      };

      const handlePostUpload=async()=>{
        try {
          setLoading(true)
          const formData=new FormData();
          formData.append("userid",loggedInUser.loggedInUser.userid);
          formData.append('caption',caption);
          formData.append("post",selectedImage); 

          const response=await fetch(`${BASE_URL}/uploadpost`,{
            method:"POST",
            body:formData,
          })
          const json=await response.json()

          if(response.ok){
            updateFeed((prevFeed) => [json, ...prevFeed,])
            setCaption("")
            setDisplayImage(null)
            onClose()
            setLoading(false)
          }
          if(response.status==400){
            alert("some bad request")
          }
          if(response.status==500){
            console.log(response)
            alert("internal server error")
          }

        } catch (error) {
            alert(error)
        }
      }

  return (
          <div>
          <Modal open={isOpen} onClose={onClose} aria-labelledby="Create Post" aria-describedby="here a user can make a post, upload images and videos">
            <Stack sx={style} spacing={4}>
                <Typography variant='h4'>Create Post</Typography>
                <Stack bgcolor={'red'} position={'relative'}>
                    <CustomPhotoinput  accept="image/*" type="file" onChange={handleImageChange} id="profile-image-input"/>
                    <img style={{zIndex:0}}  alt="profile-picture" src={displayImage?(displayImage):(defaultImage)}/>
                </Stack>

                <Stack>
                    <TextField value={caption} onChange={(e)=>setCaption(e.target.value)} variant='standard' label='Caption ...'></TextField>
                </Stack>
                <LoadingButton loadingPosition='center' disabled={caption!=='' && displayImage!==null?false:true} onClick={handlePostUpload} loading={loading} variant="contained" >
                  Post
                </LoadingButton>
            </Stack>
          </Modal>
        </div>
   
  );
}
