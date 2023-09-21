import {Stack, TextField, Typography ,Button, Alert, InputAdornment, Box} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Link} from 'react-router-dom'
import { signup } from '../api/auth';
import { LoadingButtons } from '../components/LoadingButtons';
import { Editprofile } from '../components/Editprofile';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';

export const handleSpace = (event) => {
    if (event.key === ' ' || event.keyCode === 32) {
      event.preventDefault();
    }
  };

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
        if(e.target.name==='location'){
            setCredentials({...credentials,[e.target.name]:e.target.value})
        }
        else{
            const sanitizedValue = e.target.value.replace(/\s/g, '')
            setCredentials({...credentials,[e.target.name]:sanitizedValue})
        }
    }
    const handleSignupSubmit=async()=>{
        setLoading(true)
        try {
            const result=await signup(credentials)
                if(result.success){
                    console.log(result)
                    setGlobalAlertOpen({state:true,message:`Welcome on board ${credentials.username}`})
                    setCredentials({...credentials,"user_id":result.data})
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

    const {isDarkTheme}=useContext(ThemeContext)
    const color=isDarkTheme?theme.palette.background.paper:''
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+[A-Za-z]{2,}$/;
  return (
    <>
    {
        showProfileSetup?(
            <Editprofile editProfile={false} heading={'Lets Build Your Profile'} userid={credentials.user_id} username={credentials.username} email={credentials.email} location={credentials.location}/>
        ):(
        <Stack direction={'row'} padding={'0 4vw'} width={'100vw'} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        
            <Stack  width={"30rem"} justifyContent={'center'} alignItems={"center"}>
            
                    <Stack direction={'column'} justifyContent={'center'} alignItems={'center'}>
                            <Typography variant='h3' gutterBottom color={color} fontWeight={700}>Stang<span style={{color:"#6c2ad7"}}>Chat</span></Typography>
                    </Stack>

                    <Stack mt={5} width={'100%'} spacing={2}>
                        <TextField sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor:isDarkTheme?"rgba(255, 255, 255, 0.20)":""}}} inputProps={{style:{color,borderColor:"white"},maxLength:20}} InputLabelProps={{style:{color}}} InputProps={{endAdornment:(<InputAdornment position='end'>{credentials.username!==''?("✨"):""}</InputAdornment>)}} fullWidth name='username' value={credentials.username} onChange={handleOnChange} label="Username" variant="outlined" />
                        <TextField sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor:isDarkTheme?"rgba(255, 255, 255, 0.20)":""}}} inputProps={{style:{color},maxLength:64}} InputLabelProps={{style:{color}}} name="email" helperText={!emailRegex.test(credentials.email) && credentials.email!=='' ? 'Invalid email address' : ''} error={!emailRegex.test(credentials.email) && credentials.email!==''} value={credentials.email} onChange={handleOnChange} label="Email" variant="outlined" />
                        <TextField sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor:isDarkTheme?"rgba(255, 255, 255, 0.20)":""}}} inputProps={{style:{color},maxLength:50}} name="password" InputLabelProps={{style:{color}}} type='password' helperText={credentials.password!=='' && credentials.password.length<8?<Typography variant='body2' color={isDarkTheme?theme.palette.common.white:""}>Min 8 characters</Typography>:""} value={credentials.password} onChange={handleOnChange} label="Password" variant="outlined" />
                        <TextField sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor:isDarkTheme?"rgba(255, 255, 255, 0.20)":""}}} inputProps={{style:{color},maxLength:50}} error={passwordMatch?(false):(true)} InputLabelProps={{style:{color}}} name="confirmPassword" type='password' value={credentials.confirmPassword} onChange={handleOnChange} label={credentials.password!=='' && credentials.password!==credentials.confirmPassword?"Passwords does not match":"Confirm Password"} variant="outlined" />
                        <TextField sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor:isDarkTheme?"rgba(255, 255, 255, 0.20)":""}}} inputProps={{style:{color},maxLength:20}} name="location" InputLabelProps={{style:{color}}} value={credentials.location} onChange={handleOnChange} label="Location" variant="outlined" />
                        {
                            loading?(<LoadingButtons/>)
                            :(<Button  disabled={!credentialsFilled || !passwordMatch || !emailRegex.test(credentials.email)} onClick={handleSignupSubmit} sx={{height:"3rem",'&:disabled':{bgcolor:isDarkTheme?'rgba(255, 255, 255, 0.20)':''}}} variant='contained'>Signup</Button>)
                        }
                        {
                            alert.message!==''?(
                                <>
                                <Alert onClick={()=>setAlert({"message":""})} variant='standard' severity={alert.severity}>{alert.message}</Alert>
                                </>
                            ):("")
                        }
                        
                    </Stack>

                    <Typography sx={{"textDecoration":"none",color:isDarkTheme?theme.palette.common.white:"black"}} mt={2} component={Link} variant='body2' to={'/login'}>Already Have an account? Login</Typography>

            </Stack>

        </Stack>
        )
    }

    </>
  )
}
