import {Button,Typography,Modal,Stack,TextField,styled, useTheme, useMediaQuery} from '@mui/material';
import { useContext, useState } from 'react';
import { loggedInUserContext } from '../context/user/Usercontext';
import LoadingButton from '@mui/lab/LoadingButton';
import { postContext } from '../context/posts/PostContext';
import { generateSecureFilename, handleApiResponse } from '../utils/common';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';
import AWS from 'aws-sdk'
import { BASE_URL, S3_BUCKET_NAME } from '../envVariables';
import selectimageanimtion from '../animations/selectimageanimation.json'
import Lottie from 'lottie-react';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';



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

    const {isDarkTheme}=useContext(ThemeContext)
    const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
    const bgcolor=isDarkTheme?theme.palette.common.black:theme.palette.background.paper

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
          const POST_PATH=`${loggedInUser.loggedInUser.userid}/posts/${generateSecureFilename(originalFilename)}`
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
        },
        color:color,
        bgcolor:bgcolor
      };

  return (
          <div>
          <Modal open={isOpen} onClose={handleOnClose} aria-labelledby="Create Post" aria-describedby="here a user can make a post, upload images and videos">
            <Stack sx={style} spacing={4}>
                <Typography fontWeight={300} variant='h4'>Create Post</Typography>
                <Stack position={'relative'} height={'25rem'}>
                    <CustomPhotoinput  accept="image/png, image/jpeg, image/jpg, video/mp4" type="file" onChange={handleImageChange} id="profile-image-input"/>
                    {
                      selectedVideo?(
                        <video style={{'zIndex':10}}  height={'100%'} controls src={displayVideo}></video>
                      ):(
                        
                        displayImage?(

                          <img style={{zIndex:0,aspectRatio:"auto",objectFit:"contain"}} height={'100%'} alt="profile-picture" src={displayImage?(displayImage):(defaultImage)}/>
                        ):(
                          <Lottie animationData={selectimageanimtion}></Lottie>
                        )
                      )
                    }
                </Stack>

                <Stack>
                    <TextField value={caption} onChange={(e)=>setCaption(e.target.value)} variant='standard' inputProps={{style:{color}}} InputLabelProps={{style:{color}}} label='Caption ...'></TextField>
                </Stack>
                <LoadingButton loadingPosition='center' sx={{color:color,bgcolor:bgcolor}} disabled={(caption === '' || (selectedImage === null && selectedVideo === null)) ? true : false} onClick={handlePostUpload} loading={loading} variant="contained" >
                  Post
                </LoadingButton>
            </Stack>
          </Modal>
        </div>
   
  );
}
