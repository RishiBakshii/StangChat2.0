import { Box, Stack, TextField, Typography ,Button, Alert,styled, Avatar} from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


export const Signup = () => {

    const BASE_URL=process.env.REACT_APP_API_BASE_URL;
    const navigate=useNavigate()
    const [credentials,setCredentials]=useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
        location:"",
        bio:"",
    })

    const [alert,setAlert]=useState({message:"",severity:""})
    const [showProfileSetup,setshowProfileSetup]=useState(false)

    const handleOnChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    const Custominput=styled('input')({
        height:"100%",
        width:"100%",
        cursor:"pointer"
    })

    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
          const imageUrl = URL.createObjectURL(imageFile);
          setSelectedImage(imageUrl);
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
        
        if(response.ok){
            setAlert({message:json.message,severity:"success"})
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
    
  return (
    <>
    {
        showProfileSetup?(
            <Stack height={'100vh'} bgcolor={'#191902'} justifyContent={'center'} alignItems={'center'}>
        <Typography gutterBottom variant='h3' fontWeight={900} color={'white'}>Lets build your profile</Typography>

        {/* box */}
        <Stack padding={'1rem 2rem'} bgcolor={'white'} width={'50rem'} borderRadius={'.6rem'} justifyContent={'flex-start'} alignItems={"center"}>

            <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>

                <Box zIndex={1} sx={{opacity:0}} position={'absolute'} width={150} height={150} >
                    <Custominput  accept="image/*" type="file" onChange={handleImageChange} id="profile-image-input"/>
                </Box>
                    <Avatar alt="profile-picture" src={selectedImage} sx={{ width: 150, height: 150 }}/>
                <Typography variant='h6' fontWeight={300}>{selectedImage?("Profile Looks Nice😎"):("Select a Profile Picture")}</Typography>

            </Stack>

            <Stack mt={4} width={"70%"} spacing={2}>
                <TextField label="username" variant="outlined" defaultValue={credentials.username}/>
                <TextField label="email" variant="outlined" defaultValue={credentials.email}/>
                <TextField label="Bio" multiline rows={4}/>
                <TextField label="Location" variant="outlined" defaultValue={credentials.location}/>
            </Stack>

            <Box mt={5}>
                <Button variant='contained'>Save and continue</Button>
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
                <TextField name="confirmPassword" type='password' value={credentials.confirmPassword} onChange={handleOnChange} label="Confirm Password" variant="outlined" />
                <TextField name="location" value={credentials.location} onChange={handleOnChange} label="Location" variant="outlined" />
                <Button onClick={handleSignupSubmit} sx={{height:"3rem"}} variant='contained'>Signup</Button>
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
