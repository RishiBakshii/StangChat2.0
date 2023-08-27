import { Box, Stack, TextField, Typography ,Button, Alert} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link} from 'react-router-dom'
import { signup } from '../api/auth';
import { LoadingButtons } from '../components/LoadingButtons';
import { Editprofile } from '../components/Editprofile';


export const Signup = () => {
    const [loading,setLoading]=useState(false)
    const [alert,setAlert]=useState({message:"",severity:""})
    const [showProfileSetup,setshowProfileSetup]=useState(false)
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

    useEffect(()=>{
        setPasswordMatch(credentials.password===credentials.confirmPassword)
      },[credentials.password,credentials.confirmPassword])

      useEffect(()=>{
            setCredentialsFilled(credentials.username && credentials.email && credentials.password.length>=8 && credentials.confirmPassword && credentials.location)
      },[credentials])
          
    const handleOnChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
    const handleSignupSubmit=async()=>{
        setLoading(true)
        try {
            const result=await signup(credentials)
                if(result.success){
                    setAlert({message:result.message,severity:"success"})
                    setCredentials({...credentials,["user_id"]:result.userid})
                    setTimeout(() => {
                        setshowProfileSetup(true)
                    }, 1500);
            }
        else{
            setAlert({ message: result.message, severity: "info" });
        }
        } catch (error) {
            console.log(error)
        }
        finally{
            setLoading(false)
        }
        
    }
  return (
    <>
    {
        showProfileSetup?(
            <Editprofile firstSetup={true} userid={credentials.user_id} username={credentials.username} email={credentials.email} location={credentials.location}/>
        ):(
        <Stack bgcolor={'white'} width={'100vw'} direction={'row'} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        
            <Stack bgcolor={'white'} borderRadius={".6rem"}  width={"40vw"} height={"100%"} padding={2} justifyContent={'center'} alignItems={"center"}>
            
            <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>

            <Box width={'10rem'}>
                    {/* <Lottie loop={false}  animationData={socialMediaTypo}></Lottie> */}
            </Box>
            <Typography variant='h3' color={"#191919"} fontWeight={700}>Stang<span style={{color:"#6c2ad7"}}>Chat</span></Typography>
            </Stack>

            <Stack mt={5} spacing={2} width={'60%'}>
                <TextField name='username' value={credentials.name} onChange={handleOnChange} label="Username" variant="outlined" />
                <TextField name="email" type='email' value={credentials.email} onChange={handleOnChange} label="Email" variant="outlined" />
                <TextField name="password" type='password' value={credentials.password} onChange={handleOnChange} label="Password" variant="outlined" />
                <TextField error={passwordMatch?(false):(true)} name="confirmPassword" type='password' value={credentials.confirmPassword} onChange={handleOnChange} label="Confirm Password" variant="outlined" />
                <TextField name="location" value={credentials.location} onChange={handleOnChange} label="Location" variant="outlined" />
                {
                    loading?(<LoadingButtons/>)
                    :(<Button disabled={!credentialsFilled || !passwordMatch} onClick={handleSignupSubmit} sx={{height:"3rem"}} variant='contained'>Signup</Button>)
                }
                {
                    alert!==''?(
                        <>
                        <Alert onClick={()=>setAlert("")} variant='standard' severity={alert.severity}>{alert.message}</Alert>
                        </>
                    ):("")
                }
                
            </Stack>

            <Typography sx={{"textDecoration":"none",color:"black"}} mt={2} component={Link} variant='p' to={'/login'}>Already Have an account? Login</Typography>

        </Stack>

        </Stack>
        )
    }

    </>
  )
}
