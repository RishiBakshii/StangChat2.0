import { Stack, TextField, Typography ,Button, Alert} from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { Link,useNavigate} from 'react-router-dom'
import { loggedInUserContext } from '../context/user/Usercontext';
import { login } from '../api/auth';
import { LoadingButtons } from '../components/LoadingButtons';
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';



export const Login = () => {
    const navigate=useNavigate();
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)

    const loggedInUser=useContext(loggedInUserContext)

    const [credentials,setCredentials]=useState({email:"",password:""})
    const [isCredentialsFilled,setIsCredentialsFilled]=useState(false)

    const [loading,setLoading]=useState(false)
    const [alert,setAlert]=useState({message:"",severity:'info'})

    const {isDarkTheme}=useContext(ThemeContext)

    const color=isDarkTheme?theme.palette.background.paper:''


    useEffect(()=>{
        setIsCredentialsFilled(credentials.email && credentials.password.length>=8)
    },[credentials])
    
    const handleOnChange=(e)=>{
        const sanitizedValue = e.target.value.replace(/\s/g, '')
        setCredentials({...credentials,[e.target.name]:sanitizedValue})
    }

    const handleLoginSubmit=async()=>{
        setLoading(true)
        try {
            const result=await login(credentials)
            if(result.success){
                setGlobalAlertOpen({state:true,message:'Login Sucessful'})
                loggedInUser.updateLoggedInUser(result.data)
                navigate("/") 
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
    <Stack direction={'row'} padding={'0 4vw'} width={'100vw'} justifyContent={"center"} alignItems={"center"} height={"100vh"}> 
        <Stack width={"30rem"}  justifyContent={'center'} alignItems={"center"}>
            <Typography gutterBottom variant='h3' color={color} fontWeight={700}>Stang<span style={{color:"#6c2ad7"}}>Chat</span></Typography>
            {/* <Typography variant='h5' color={"#191919"} style={{color:"#6c2ad7"}} fontWeight={700}>Launching this tuesday🎉</Typography> */}
            <Stack mt={5} spacing={2} width={'100%'}>
                <TextField inputProps={{style:{color:color,},maxLength:64}} sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor:isDarkTheme?"rgba(255, 255, 255, 0.20)":""}}} InputLabelProps={{style:{color}}}   name='email' label="Email" variant="outlined"  value={credentials.email}  onChange={handleOnChange}/>
                <TextField inputProps={{style:{color},maxLength:50}} sx={{'& .MuiOutlinedInput-notchedOutline':{borderColor:isDarkTheme?"rgba(255, 255, 255, 0.20)":""}}} InputLabelProps={{style:{color}}} type='password' name='password' label="Password" variant="outlined" value={credentials.password} onChange={handleOnChange}/>
                {
                    loading?(<LoadingButtons/>)
                    :
                    (
                    <Button disabled={!isCredentialsFilled}  onClick={handleLoginSubmit} sx={{height:"3rem",color:color ,'&:disabled':{bgcolor:isDarkTheme?'rgba(255, 255, 255, 0.20)':''}}} variant='contained'>Login</Button>
                    )
                }
                {
                    alert.message!==''?(<Alert onClick={()=>setAlert({"message":""})} variant='standard' severity={alert.severity}>{alert.message}</Alert>):("")
                }
            </Stack>
            <Typography sx={{"textDecoration":"none",color:isDarkTheme?theme.palette.common.white:"black"}} mt={2} component={Link} variant='body2' to={'/signup'}>Create a new account</Typography>
        </Stack>
    </Stack>
    </>
  )
}
