import { Box, Stack, TextField, Typography ,Button, Alert} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Link} from 'react-router-dom'
import { signup } from '../api/auth';
import { LoadingButtons } from '../components/LoadingButtons';
import { Editprofile } from '../components/Editprofile';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';


export const Signup = () => {
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
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
                    console.log(result)
                    setGlobalAlertOpen({state:true,message:`Welcome on board ${credentials.username}`})
                    setCredentials({...credentials,["user_id"]:result.data})
                    setshowProfileSetup(true)
            }
                else{
                    setGlobalAlertOpen({state:true,message:result.message})
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
            <Editprofile editProfile={false} heading={'Lets Build Your Profile'} userid={credentials.user_id} username={credentials.username} email={credentials.email} location={credentials.location}/>
        ):(
        <Stack direction={'row'} padding={'0 4vw'} width={'100vw'} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        
            <Stack  width={"30rem"} justifyContent={'center'} alignItems={"center"}>
            
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                            <Typography variant='h3' color={"#191919"} fontWeight={700}>Stang<span style={{color:"#6c2ad7"}}>Chat</span></Typography>
                    </Stack>

                    <Stack mt={5} width={'100%'} spacing={2}>
                        <TextField fullWidth name='username' value={credentials.username} onChange={handleOnChange} label="Username" variant="outlined" />
                        <TextField name="email" type='email' value={credentials.email} onChange={handleOnChange} label="Email" variant="outlined" />
                        <TextField name="password" type='password' value={credentials.password} onChange={handleOnChange} label="Password" variant="outlined" />
                        <TextField error={passwordMatch?(false):(true)} name="confirmPassword" type='password' value={credentials.confirmPassword} onChange={handleOnChange} label="Confirm Password" variant="outlined" />
                        <TextField name="location" value={credentials.location} onChange={handleOnChange} label="Location" variant="outlined" />
                        {
                            loading?(<LoadingButtons/>)
                            :(<Button disabled={!credentialsFilled || !passwordMatch} onClick={handleSignupSubmit} sx={{height:"3rem"}} variant='contained'>Signup</Button>)
                        }
                        {
                            alert.message!==''?(
                                <>
                                <Alert onClick={()=>setAlert({"message":""})} variant='standard' severity={alert.severity}>{alert.message}</Alert>
                                </>
                            ):("")
                        }
                        
                    </Stack>

                    <Typography sx={{"textDecoration":"none",color:"black"}} mt={2} component={Link} variant='body2' to={'/login'}>Already Have an account? Login</Typography>

            </Stack>

        </Stack>
        )
    }

    </>
  )
}
