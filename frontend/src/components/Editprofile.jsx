import {Stack,Box,Avatar,TextField,Typography,Snackbar,Button,styled, Slide, useMediaQuery, useTheme} from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import {BASE_URL} from '../screens/Home'
import { useNavigate } from 'react-router-dom';
import { LoadingButtons } from './LoadingButtons';
import { ImageSelector, handleApiResponse } from '../utils/common';
import { updateProfile } from '../api/user';
import { loggedInUserContext } from '../context/user/Usercontext';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';
import { SERVER_DOWN_MESSAGE } from '../envVariables';


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

    const [selectedImage,setSelectedImage]=useState(null)
    const [displayImage,setDisplayImage]=useState(null)

    const [editProfileSelectedImage,setEditProfileSelectedImage]=useState(null)
    const [editProfileDisplayImage,setEditProfileDisplayImage]=useState(profilePath)

    const [editProfileCredentialsFilled,setEditProfileCredentialsFilled]=useState(null)
    const theme=useTheme()
    const MD=useMediaQuery(theme.breakpoints.down("md"))

    const isAnythingChanged =
  (editProfileCredentials.username.trim() !== loggedInUser.loggedInUser.username.trim() ||
  editProfileCredentials.email.trim() !== loggedInUser.loggedInUser.email.trim() ||
  editProfileDisplayImage !== profilePath ||
  editProfileCredentials.location.trim() !== loggedInUser.loggedInUser.location.trim() ||
  editProfileCredentials.bio.trim() !== loggedInUser.loggedInUser.bio.trim()) &&
  editProfileCredentials.username.trim() !== "" &&
  editProfileCredentials.email.trim() !== "" &&
  editProfileCredentials.location.trim() !== "";
    const handleAvatarChange=(event)=>{
        const result=ImageSelector(event)
        console.log(result)
        setEditProfileDisplayImage(result.displayImage)
        setEditProfileSelectedImage(result.selectedImage)
        setDisplayImage(result.displayImage)
        setSelectedImage(result.selectedImage)  
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
        const result=await updateProfile(credentials,selectedImage)
        if(result.success){
            setState({open:true,message:result.message,Transition:SlideTransition})
            setTimeout(() => {
              navigate("/login")
            }, 1200);
        }
        else{
            setState({open:true,message:result.message,Transition:SlideTransition})
        }
      } catch (error) {
        console.log(error)
      }
      finally{
        setLoading(false)
      }
        
    }
    
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

        if(editProfileDisplayImage!==profilePath){
          formData.append("profilePicture",editProfileSelectedImage); 
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

                    <Typography variant='h6' fontWeight={300}>{selectedImage?("Profile Looks Nice😎"):("Select a Profile Picture")}</Typography>

                </Stack>


                <Stack mt={4} width={"100%"} spacing={2}>
                  
                    {
                      editProfile?(
                        <>
                    <TextField inputProps={{maxLength:20}} name='username' label="Username" variant="outlined" onChange={handleEditProfileOnChange} value={editProfileCredentials.username}/>
                    <TextField name='email' label="Email" value={editProfileCredentials.email} onChange={handleEditProfileOnChange}/>
                    <TextField name='bio' inputProps={{maxLength:1000}} label="Bio" multiline rows={4} defaultValue={bio} value={editProfileCredentials.bio} onChange={handleEditProfileOnChange}/>
                    <TextField name='location' label="Location" variant="outlined"  defaultValue={location} value={editProfileCredentials.location} onChange={handleEditProfileOnChange}/>
                        </>
                      ):(
                        <>
                    <TextField label="Username" variant="outlined" defaultValue={credentials.username} InputProps={{readOnly: true,}}/>
                    <TextField label="Email" defaultValue={credentials.email} InputProps={{readOnly: true,}}/>
                    <TextField name='bio' label="Bio" multiline rows={4} value={credentials.bio} onChange={handleOnChange}/>
                    <TextField label="Location" variant="outlined" defaultValue={credentials.location}  InputProps={{readOnly: true,}}/>
                    </>
                      )
                    }

                </Stack>
                
                {
                  editProfile?(
                    <Box mt={5}>
                    {loading?(<LoadingButtons/>)
                    :(<Button onClick={handleProfileUpdateClick} fullWidth disabled={!isAnythingChanged} variant='contained'>Update Profile</Button>)
                    }
                </Box>
                  ):(
                     <Box mt={5}>
                    {loading?(<LoadingButtons/>)
                    :(<Button onClick={handleSaveAndContinueClick} fullWidth disabled={!credentials.bio.length} variant='contained'>Save and continue</Button>)
                    }
                </Box>
                  )
                }
               
                    
                


          </Stack>

          <Snackbar open={state.open} onClose={handleClose} TransitionComponent={state.Transition} message={state.message} key={state.Transition.name}/>
      </Stack>
  )
}
