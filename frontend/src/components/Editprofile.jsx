import {Stack,Box,Avatar,TextField,Typography,Snackbar,Button,styled, Slide} from '@mui/material'
import { useContext, useState } from 'react';
import {BASE_URL} from '../screens/Home'
import { useNavigate } from 'react-router-dom';
import { LoadingButtons } from './LoadingButtons';
import { ImageSelector } from '../utils/common';
import { updateProfile } from '../api/user';
import { loggedInUserContext } from '../context/user/Usercontext';


export const Editprofile = ({userid,username,email,location}) => {

    const loggedInUser=useContext(loggedInUserContext)
    const navigate=useNavigate()
    const [credentials,setCredentials]=useState({
      'user_id':userid,
      "username":username,
      "email":email,
      "location":location,
      'bio':''
    })
    const [loading,setLoading]=useState(false)
    const [selectedImage,setSelectedImage]=useState(null)
    const [displayImage,setDisplayImage]=useState(null)
    const CustomPhotoinput=styled('input')({
        height:"100%",
        width:"100%",
        cursor:"pointer"
    })

    const handleAvatarChange=(event)=>{
        const result=ImageSelector(event)
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
  return (
      <Stack height={'100vh'} justifyContent={'center'} alignItems={'center'}>

            
                <Typography variant='h4' fontWeight={600} color={'#191919'}>Edit your profile here</Typography>


            <Stack padding={'1rem 2rem'} bgcolor={'white'} width={'50rem'} borderRadius={'.6rem'} justifyContent={'flex-start'} alignItems={"center"}>

                <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>
                    <Box zIndex={1} sx={{opacity:0}} position={'absolute'} width={150} height={150} >

                        <CustomPhotoinput  accept="image/*" type="file" onChange={handleAvatarChange} id="profile-image-input"/>
                      
                    </Box>
                    <Avatar alt="profile-picture" src={displayImage} sx={{ width: 180, height: 180 }}/>
                    <Typography variant='h6' fontWeight={300}>{selectedImage?("Profile Looks Nice😎"):("Select a Profile Picture")}</Typography>
                </Stack>


                    <Stack mt={4} width={"70%"} spacing={2}>
                    <TextField label="Username" variant="outlined" defaultValue={credentials.username} InputProps={{readOnly: true,}}/>
                    <TextField label="Email" defaultValue={credentials.email} InputProps={{readOnly: true,}}/>
                    <TextField name='bio' label="Bio" multiline rows={4} value={credentials.bio} onChange={handleOnChange}/>
                    <TextField label="Location" variant="outlined" defaultValue={credentials.location}  InputProps={{readOnly: true,}}/>
                </Stack>

                <Box mt={5}>
                    {loading?(<LoadingButtons/>)
                    :(<Button onClick={handleSaveAndContinueClick} fullWidth disabled={!credentials.bio.length} variant='contained'>Save and continue</Button>)
                    }
                </Box>
                    
                


          </Stack>

          <Snackbar open={state.open} onClose={handleClose} TransitionComponent={state.Transition} message={state.message} key={state.Transition.name}/>
      </Stack>
  )
}
