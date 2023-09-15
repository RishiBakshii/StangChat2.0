import {Stack,Box,Avatar,TextField,Typography,Snackbar,Button,styled, Slide, useMediaQuery, useTheme, InputAdornment} from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import {BASE_URL} from '../screens/Home'
import { useNavigate } from 'react-router-dom';
import { LoadingButtons } from './LoadingButtons';
import { ImageSelector, generateSecureFilename, handleApiResponse } from '../utils/common';
import { updateProfile } from '../api/user';
import { loggedInUserContext } from '../context/user/Usercontext';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';
import { BUCKET_URL, DEFAULT_PROFILE_PATH, S3_BUCKET_NAME, SERVER_DOWN_MESSAGE } from '../envVariables';
import AWS from 'aws-sdk'
import { handleSpace } from '../screens/Signup';


export const Editprofile = ({userid,username,email,bio,location,heading,editProfile,profilePath}) => {
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
    const loggedInUser=useContext(loggedInUserContext)
    const navigate=useNavigate()
    const [credentials,setCredentials]=useState({
      'user_id':userid,
      "username":username,
      "email":email,
      "location":location,
      'bio':''
    })

    const [editProfileCredentials,setEditProfileCredentials]=useState({
      "userid":userid,
      "username":username,
      "email":email,
      "bio":bio,
      "location":location,
    })

    const [loading,setLoading]=useState(false)

    const [selectedImage,setSelectedImage]=useState('not')
    const [displayImage,setDisplayImage]=useState(null)

    const [originalFilename,setOriginalFilename]=useState("")

    const [editProfileSelectedImage,setEditProfileSelectedImage]=useState(null)
    const [editProfileDisplayImage,setEditProfileDisplayImage]=useState(`${BUCKET_URL}/${profilePath}`)

    const [editProfileCredentialsFilled,setEditProfileCredentialsFilled]=useState(null)
    const theme=useTheme()
    const MD=useMediaQuery(theme.breakpoints.down("md"))

    let isAnythingChanged=false
    if(editProfile){
      if (
      editProfileCredentials.username !== loggedInUser.loggedInUser.username ||
      editProfileCredentials.email !== loggedInUser.loggedInUser.email ||
      editProfileDisplayImage !== `${BUCKET_URL}/${profilePath}` ||
      editProfileCredentials.location !== loggedInUser.loggedInUser.location ||
      editProfileCredentials.bio !== loggedInUser.loggedInUser.bio
    ) {
      isAnythingChanged=true
    }

    }
    
    


    const handleAvatarChange=(event)=>{
        const result=ImageSelector(event)

        setEditProfileDisplayImage(result.displayImage)
        setEditProfileSelectedImage(result.selectedImage)

        setDisplayImage(result.displayImage)
        setSelectedImage(result.selectedImage)  

        setOriginalFilename(result.filename)
    }

      const handleClose = () => {
        setState({
          ...state,
          open: false,
        });
      };

      const [state, setState] = useState({
        open: false,
        Transition: SlideTransition,
        message:''
      });

      function SlideTransition(props) {
        return <Slide {...props} direction="up" />;
      }

      const handleOnChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
      
    const handleSaveAndContinueClick=async()=>{
      setLoading(true)
      try {
        const result=await updateProfile(credentials,selectedImage,generateSecureFilename(originalFilename))
        if(result.success){
            setState({open:true,message:result.message,Transition:SlideTransition})
            setTimeout(() => {
              navigate("/login")
            }, 1000);
        }
        else{
            setState({open:true,message:result.message,Transition:SlideTransition})
        }
      } catch (error) {
        setState({open:true,message:'Some Error Occured😭',Transition:SlideTransition})
        console.log(error)
      }
      finally{
        setLoading(false)
      }
    }

    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$/;

    // 401 handled✅
    const handleProfileUpdateClick=async()=>{
      try {
        const formData=new FormData();
        formData.append("userid",editProfileCredentials.userid);

        if(loggedInUser.loggedInUser.username!==editProfileCredentials.username && editProfileCredentials.username!==''){
          formData.append('username',editProfileCredentials.username)
        }

        if(loggedInUser.loggedInUser.email!==editProfileCredentials.email && editProfileCredentials.email!==''){
          formData.append("email",editProfileCredentials.email); 
        }

        console.log('displayimage',editProfileDisplayImage)
        console.log("profilePath",`${BUCKET_URL}/${profilePath}`)
        console.log("do they match ?",editProfileDisplayImage===`${BUCKET_URL}/${profilePath}`)

        if(editProfileDisplayImage!==`${BUCKET_URL}/${profilePath}`){
          const s3=new AWS.S3();
          const PROFILE_PATH=`${loggedInUser.loggedInUser.userid}/profile/${generateSecureFilename(originalFilename)}`
          const params={
            Bucket:S3_BUCKET_NAME,
            Key:PROFILE_PATH,
            Body:editProfileSelectedImage
          }
          const uploadResult = await s3.upload(params).promise();

          const paramsToDelete={
            Bucket: S3_BUCKET_NAME,
            Key: profilePath
          }
          
          if(loggedInUser.loggedInUser.profilePicture!=='default-profile-picture/defaultProfile.png'){
            try{
              await s3.deleteObject(paramsToDelete).promise()
            }
            catch (error){
              console.log(error)
            }
          }
          

          formData.append("profilePath",PROFILE_PATH)
        }

        if(loggedInUser.loggedInUser.location!==editProfileCredentials.location && editProfileCredentials.location!==''){
          formData.append("location",editProfileCredentials.location); 
        }
        if(loggedInUser.loggedInUser.bio!==editProfileCredentials.bio){
          formData.append("bio",editProfileCredentials.bio)
        }

        const response=await fetch(`${BASE_URL}/editprofile`,{
          method:"POST",
          body:formData,
          credentials:"include"
        })

        const result=await handleApiResponse(response)

        if(result.success){
          navigate("/")
          setTimeout(() => {
            loggedInUser.updateLoggedInUser(result.data)
            setGlobalAlertOpen({state:true,message:'Profile Updated🚀'})
          }, 1500);
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
    }

    useEffect(()=>{
      setEditProfileCredentialsFilled(editProfileCredentials.username && editProfileCredentials.email && editProfileCredentials.bio && editProfileCredentials.location)
    },[editProfileCredentials])

    const handleEditProfileOnChange=(e)=>{
      setEditProfileCredentials({...editProfileCredentials,[e.target.name]:e.target.value})
    }

  return (
      <Stack padding={'0 4vw'}  width={'100vw'} justifyContent={"center"} alignItems={"center"} height={"100vh"}>

            
            <Stack width={MD?("90%"):"30rem"} justifyContent={'center'} alignItems={"center"}>


                <Typography variant='h5' fontWeight={400} color={'#191919'}>{heading}</Typography>


                <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>

                    <Box zIndex={1} sx={{opacity:0}} position={'absolute'} width={150} height={150} >

                        <input style={{cursor:"pointer",height:"100%",width:'100%'}} accept="image/*" type="file" onChange={handleAvatarChange} id="profile-image-input"/>
                    </Box>
                    
                    {
                      editProfile?(
                        <Avatar key={editProfileDisplayImage} alt="profile-picture" src={editProfileDisplayImage} sx={{ width: 180, height: 180 }}/>
                      ):(

                        <Avatar key={displayImage} alt="profile-picture" src={displayImage} sx={{ width: 180, height: 180 }}/>
                      )
                    }

                    <Typography p={2} variant='h6' fontWeight={300}>{displayImage?("Is that you? we are feeling a connection already😳"):(`${username} we would love to have you on board with a picture of yours😀\n`)}</Typography>

                </Stack>


                <Stack mt={4} width={"100%"} spacing={2}>
                  
                    {
                      editProfile?(
                        <>
                    <TextField onKeyDown={handleSpace} inputProps={{maxLength:20}} name='username' label="Username" variant="outlined" onChange={handleEditProfileOnChange} value={editProfileCredentials.username}/>
                    <TextField onKeyDown={handleSpace} inputProps={{maxLength:64}} helperText={!emailRegex.test(editProfileCredentials.email) && editProfileCredentials.email!=='' ? 'Invalid email address' : ''} name='email' label="Email" value={editProfileCredentials.email} onChange={handleEditProfileOnChange}/>
                    <TextField InputProps={{endAdornment:(<InputAdornment position='end'><Typography color='text.secondary' variant='body2'>{`${editProfileCredentials.bio.length}/60`}</Typography></InputAdornment>)}} name='bio' inputProps={{maxLength:60}} label="Bio" multiline rows={4} defaultValue={bio} value={editProfileCredentials.bio} onChange={handleEditProfileOnChange}/>
                    <TextField inputProps={{maxLength:20}} name='location' label="Location" variant="outlined"  defaultValue={location} value={editProfileCredentials.location} onChange={handleEditProfileOnChange}/>
                        </>
                      ):(
                        <>
                    <TextField label="Username" variant="outlined" defaultValue={credentials.username} InputProps={{readOnly: true,}}/>
                    <TextField label="Email" defaultValue={credentials.email} InputProps={{readOnly: true,}}/>
                    <TextField InputProps={{endAdornment:(<InputAdornment position='end'><Typography color='text.secondary' variant='body2'>{`${credentials.bio.length}/60`}</Typography></InputAdornment>)}} inputProps={{maxLength:60}} name='bio' label="Bio" multiline rows={4} value={credentials.bio} onChange={handleOnChange}/>
                    <TextField label="Location" variant="outlined" defaultValue={credentials.location}  InputProps={{readOnly: true,}}/>
                    </>
                      )
                    }

                </Stack>
                
                {
                  editProfile?(
                    <Box mt={5}>
                    {loading?(<LoadingButtons/>)
                    :(<Button sx={{m:1}} onClick={handleProfileUpdateClick} fullWidth disabled={!isAnythingChanged || !emailRegex.test(editProfileCredentials.email)} variant='contained'>Update Profile</Button>)
                    }
                </Box>
                  ):(
                     <Box mt={5}>
                    {loading?(<LoadingButtons/>)
                    :(<Button sx={{m:6}} onClick={handleSaveAndContinueClick} fullWidth disabled={!credentials.bio.length} variant='contained'>Save and continue</Button>)
                    }
                </Box>
                  )
                }
               
                    
                


          </Stack>

          <Snackbar open={state.open} onClose={handleClose} TransitionComponent={state.Transition} message={state.message} key={state.Transition.name}/>
      </Stack>
  )
}
