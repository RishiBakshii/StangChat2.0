import {Stack,Box,Avatar,TextField,Typography,Snackbar,Button,styled, Slide, useMediaQuery, useTheme} from '@mui/material'
import { useContext, useEffect, useState } from 'react';
import {BASE_URL} from '../screens/Home'
import { useNavigate } from 'react-router-dom';
import { LoadingButtons } from './LoadingButtons';
import { ImageSelector } from '../utils/common';
import { updateProfile } from '../api/user';
import { loggedInUserContext } from '../context/user/Usercontext';


export const Editprofile = ({userid,username,email,bio,location,heading,editProfile,profilePath}) => {

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

    const CustomPhotoinput=styled('input')({
        height:"100%",
        width:"100%",
        cursor:"pointer"
    })

    const theme=useTheme()
    const MD=useMediaQuery(theme.breakpoints.down("md"))

    const handleAvatarChange=(event)=>{
        const result=ImageSelector(event)
          if(editProfile){
            setEditProfileDisplayImage(result.displayImage)
            setEditProfileSelectedImage(result.selectedImage)
          }
          else{
            setDisplayImage(result.displayImage)
            setSelectedImage(result.selectedImage)
          }
        
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

    const handleProfileUpdateClick=async()=>{
      try {

        const formData=new FormData();
        formData.append("userid",editProfileCredentials.userid);
        formData.append('username',editProfileCredentials.username);
        formData.append("email",editProfileCredentials.email); 
        formData.append("bio",editProfileCredentials.bio); 
        formData.append("location",editProfileCredentials.location); 
        formData.append("profilePicture",editProfileSelectedImage); 

        const response=await fetch(`${BASE_URL}/editprofile`,{
          method:"POST",
          body:formData
        })

        console.log(formData)

        const json=await response.json()

        if(response.ok){
          alert("success")
          navigate('/')
        }
        if(response.status===400){
          alert(json.message)
        }
        if(response.status===500){
          alert("internal server error")
          console.log(json)
        }

      } catch (error) {
        alert('frontend-error')
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
                        <CustomPhotoinput  accept="image/*" type="file" onChange={handleAvatarChange} id="profile-image-input"/>
                    </Box>
                    
                    {
                      editProfile?(
                        <Avatar alt="profile-picture" src={editProfileDisplayImage} sx={{ width: 180, height: 180 }}/>
                      ):(

                        <Avatar alt="profile-picture" src={displayImage} sx={{ width: 180, height: 180 }}/>
                      )
                    }

                    <Typography variant='h6' fontWeight={300}>{selectedImage?("Profile Looks Nice😎"):("Select a Profile Picture")}</Typography>

                </Stack>


                <Stack mt={4} width={"100%"} spacing={2}>
                  
                    {
                      editProfile?(
                        <>
                    <TextField name='username' label="Username" variant="outlined" onChange={handleEditProfileOnChange} value={editProfileCredentials.username}/>
                    <TextField name='email' label="Email" value={editProfileCredentials.email} onChange={handleEditProfileOnChange}/>
                    <TextField name='bio' label="Bio" multiline rows={4} defaultValue={bio} value={editProfileCredentials.bio} onChange={handleEditProfileOnChange}/>
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
                    :(<Button onClick={handleProfileUpdateClick} fullWidth disabled={!editProfileCredentialsFilled} variant='contained'>Update Profile</Button>)
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
