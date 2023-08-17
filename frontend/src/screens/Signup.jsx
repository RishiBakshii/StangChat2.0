import { Box, Stack, TextField, Typography ,Button, Alert,styled, Avatar} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const Signup = () => {
    const [alert,setAlert]=useState({message:"",severity:""})
    const [showProfileSetup,setshowProfileSetup]=useState(false)
    const [selectedImage, setSelectedImage] = useState(null);
    const [displayImage,setDisplayImage]=useState(null)
    const [credentials,setCredentials]=useState({
        user_id:"",
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
        location:"",
        bio:"",
    })

    const [credentialsFilled,setCredentialsFilled]=useState(false)
    const [passwordMatch,setPasswordMatch]=useState(false)

    const navigate=useNavigate()
    useEffect(()=>{
        setPasswordMatch(credentials.password===credentials.confirmPassword)
      },[selectedImage,credentials.password,credentials.confirmPassword])

      useEffect(()=>{
            setCredentialsFilled(credentials.username && credentials.email && credentials.password.length>=8 && credentials.confirmPassword && credentials.location)
      },[credentials])

      
    const handleOnChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    const Custominput=styled('input')({
        height:"100%",
        width:"100%",
        cursor:"pointer"
    })
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
    const handleSignupSubmit=async()=>{

        try {
            const response= await fetch(`${BASE_URL}/signup`,{
            method:"POST",
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify({
                "username":credentials.username,
                "email":credentials.email,
                "password":credentials.password, 
                "location":credentials.location
            })
        })
        const json=await response.json()
        console.log(`user id received from json ${json.userid}`)
        
        if(response.ok){
            setAlert({message:json.message,severity:"success"})

            setCredentials({...credentials,["user_id"]:json.userid})

            setTimeout(() => {
                setshowProfileSetup(true)
            }, 1500);
        }
        else{
            setAlert({message:json.message,severity:"info"})
        }
        } catch (error) {
            setAlert(error)
        }
        

    }
    const handleSaveAndContinueClick=async()=>{
        console.log(credentials.user_id)
        try {
            const formData=new FormData();
            formData.append("userid", credentials.user_id);
            formData.append("bio", credentials.bio);
            formData.append("profilepicture", selectedImage); 

            const response=await fetch(`${BASE_URL}/updateprofile`,{
                method:"POST",
                body:formData,
            })  

            const json=await response.json()
            
            if(response.ok){
                setTimeout(() => {
                    navigate('/login')
                }, 1000);
            }
            else{
                prompt("some error occured")
            }

        } catch (error) {
            prompt(error)
        }

        
    }
  return (
    <>
    {
        showProfileSetup?(
            <Stack height={'100vh'} bgcolor={'#edeef7'} justifyContent={'center'} alignItems={'center'}>
                <Typography gutterBottom variant='h3' fontWeight={900} color={'black'}>Lets build your profile</Typography>

            <Stack padding={'1rem 2rem'} bgcolor={'white'} width={'50rem'} borderRadius={'.6rem'} justifyContent={'flex-start'} alignItems={"center"}>

                <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>

                    <Box zIndex={1} sx={{opacity:0}} position={'absolute'} width={150} height={150} >
                        <Custominput  accept="image/*" type="file" onChange={handleImageChange} id="profile-image-input"/>
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
                    <Button onClick={handleSaveAndContinueClick} disabled={!credentials.bio.length} variant='contained'>Save and continue</Button>
                </Box>
            </Stack>
            </Stack>
        ):(
        <Stack bgcolor={'#edeef7'} width={'100vw'} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        
            <Stack bgcolor={'white'} borderRadius={".6rem"}  width={"40vw"} height={"40rem"} padding={2} justifyContent={'center'} alignItems={"center"}>

            <Typography variant='h3' color={"primary"} fontWeight={700}>Community Connect</Typography>

            <Stack mt={5} spacing={2} width={'60%'}>
                <TextField name='username' value={credentials.name} onChange={handleOnChange} label="Name" variant="outlined" />
                <TextField name="email" type='email' value={credentials.email} onChange={handleOnChange} label="Email" variant="outlined" />
                <TextField name="password" type='password' value={credentials.password} onChange={handleOnChange} label="Password" variant="outlined" />
                <TextField error={passwordMatch?(false):(true)} name="confirmPassword" type='password' value={credentials.confirmPassword} onChange={handleOnChange} label="Confirm Password" variant="outlined" />
                <TextField name="location" value={credentials.location} onChange={handleOnChange} label="Location" variant="outlined" />
                <Button disabled={!credentialsFilled || !passwordMatch} onClick={handleSignupSubmit} sx={{height:"3rem"}} variant='contained'>Signup</Button>
                {
                    alert!==''?(
                        <>
                        <Alert onClick={()=>setAlert("")} variant='standard' severity={alert.severity}>{alert.message}</Alert>
                        </>
                    ):("")
                }
                
            </Stack>

            <Typography sx={{"textDecoration":"none"}} mt={2} component={Link} variant='p' to={'/login'}>Already Have an account? Login</Typography>

        </Stack>

        </Stack>
        )
    }

    </>
  )
}
