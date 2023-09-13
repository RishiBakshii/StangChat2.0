import {Button,Typography,Modal,Stack,TextField,styled, useTheme, useMediaQuery} from '@mui/material';
import { useContext, useState } from 'react';
import { loggedInUserContext } from '../context/user/Usercontext';
import LoadingButton from '@mui/lab/LoadingButton';
import { postContext } from '../context/posts/PostContext';
import { handleApiResponse } from '../utils/common';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';
import AWS from 'aws-sdk'
import { BASE_URL, S3_BUCKET_NAME } from '../envVariables';



const CustomPhotoinput=styled('input')({
    height:"100%",
    width:"100%",
    cursor:"pointer",
    zIndex:1,
    opacity:0,
    position:"absolute"
})

export const PostModal=({ isOpen, onClose})=> {
    const loggedInUser=useContext(loggedInUserContext)
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
    const {setFeed}=useContext(postContext)

    const theme=useTheme()
    const is480=useMediaQuery(theme.breakpoints.down("480"))

    const [selectedImage, setSelectedImage] = useState(null);
    const [displayImage,setDisplayImage]=useState(null)
    const [originalFilename, setOriginalFilename] = useState('')

    const [selectedVideo, setSelectedVideo] = useState(null);
    const [displayVideo, setDisplayVideo] = useState(null);

    const [caption,setCaption]=useState('')
    const [loading,setLoading]=useState(false)


    const defaultImage="https://t4.ftcdn.net/jpg/04/99/93/31/240_F_499933117_ZAUBfv3P1HEOsZDrnkbNCt4jc3AodArl.jpg"

    const handleOnClose=()=>{
      setSelectedImage(null)
      setDisplayImage(null)
      setSelectedVideo(null)
      setDisplayVideo(null)
      setOriginalFilename('')
      setCaption('')
      onClose()
    }

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      
      if (file) {
        const mimeType = file.type;
        setOriginalFilename(file.name);
    
        if (mimeType.startsWith("image/")) {
          setSelectedImage(file);
          setDisplayImage(URL.createObjectURL(file));
        } else if (mimeType.startsWith("video/")) {
          setSelectedVideo(file);
          setDisplayVideo(URL.createObjectURL(file));
        }
      }
    };
    
    
    const handlePostUpload=async()=>{
      setLoading(true)
        try {
          const s3=new AWS.S3();
          const POST_PATH=`${loggedInUser.loggedInUser.userid}/posts/${originalFilename}`

          const params={
            Bucket:S3_BUCKET_NAME,
            Key:POST_PATH,
            Body:selectedImage || selectedVideo
          }
          const uploadResult = await s3.upload(params).promise();

          const response=await fetch(`${BASE_URL}/uploadpost`,{
            method:"POST",
            headers:{
              'Content-Type':"application/json"
            },
            body:JSON.stringify({
              'userid':loggedInUser.loggedInUser.userid,
              'postPath':POST_PATH,
              'caption':caption,
            }),
            credentials:"include"
          })
          const result=await handleApiResponse(response)

          if(result.success){
            setGlobalAlertOpen({state:true,message:'Post Uploaded 🚀'})
            setFeed((prevFeed) => [result.data, ...prevFeed,])
            setCaption('')
            setDisplayImage(null)
            setLoading(false)
            handleOnClose()
          }
          else{
            setGlobalAlertOpen({state:true,message:result.message})
          }

        } catch (error) {
          console.log(error)
          setGlobalAlertOpen({state:true,message:"Some error occured🥲"})
        }
        finally{
          setLoading(false)
        }
      }

      const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius:".4rem",
        [theme.breakpoints.down('480')]:{
          width:'18rem'
        }
      };

  return (
          <div>
          <Modal open={isOpen} onClose={handleOnClose} aria-labelledby="Create Post" aria-describedby="here a user can make a post, upload images and videos">
            <Stack sx={style} spacing={4}>
                <Typography fontWeight={300} variant='h4'>Create Post</Typography>
                <Stack position={'relative'}>
                    <CustomPhotoinput  accept="image/png, image/jpeg, image/jpg, video/mp4" type="file" onChange={handleImageChange} id="profile-image-input"/>
                    {
                      selectedVideo?(
                        <video style={{'zIndex':10}} controls src={displayVideo}></video>
                      ):(

                        <img style={{zIndex:0}}  alt="profile-picture" src={displayImage?(displayImage):(defaultImage)}/>
                      )
                    }
                </Stack>

                <Stack>
                    <TextField value={caption} onChange={(e)=>setCaption(e.target.value)} variant='standard' label='Caption ...'></TextField>
                </Stack>
                <LoadingButton loadingPosition='center' disabled={(caption === '' || (selectedImage === null && selectedVideo === null)) ? true : false} onClick={handlePostUpload} loading={loading} variant="contained" >
                  Post
                </LoadingButton>
            </Stack>
          </Modal>
        </div>
   
  );
}
