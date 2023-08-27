import { Stack, TextField, Typography ,Button, Alert} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton';
import React, { useContext, useEffect, useState } from 'react'
import { Link,useNavigate} from 'react-router-dom'
import { loggedInUserContext } from '../context/user/Usercontext';
import { login } from '../api/auth';
import { LoadingButtons } from '../components/LoadingButtons';

export const Login = () => {
    const navigate=useNavigate();
    const loggedInUser=useContext(loggedInUserContext)
    const [credentials,setCredentials]=useState({
        email:"",
        password:""
    })
    const [loading,setLoading]=useState(false)
    const [isCredentialsFilled,setIsCredentialsFilled]=useState(false)
    const [alert,setAlert]=useState({message:"",severity:""})
    useEffect(()=>{
        setIsCredentialsFilled(credentials.email && credentials.password.length>=8)
    },[credentials])
    const handleOnChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }

    const handleLoginSubmit=async()=>{
        setLoading(true)
        try {
            const result=await login(credentials)
            if(result.success){
            setAlert({message:result.message,severity:"success"})
            loggedInUser.updateLoggedInUser(result.userdata)
            setTimeout(()=>{navigate("/");},1500)
            }
            else{
            setAlert({message:result.message,severity:"info"})
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
            <Typography variant='h3' color={"#191919"} fontWeight={700}>Stang<span style={{color:"#6c2ad7"}}>Chat</span></Typography>
            <Stack mt={5} spacing={2} width={'100%'}>
                <TextField  name='email' label="Email" variant="outlined"  value={credentials.email}  onChange={handleOnChange}/>
                <TextField  type='password' name='password' label="Password" variant="outlined" value={credentials.password} onChange={handleOnChange}/>
                {
                    loading?(<LoadingButtons/>)
                    :(<Button disabled={!isCredentialsFilled} onClick={handleLoginSubmit} sx={{height:"3rem"}} variant='contained'>Login</Button>)
                }
                {
                    alert!==''?(<Alert onClick={()=>setAlert("")} variant='standard' severity={alert.severity}>{alert.message}</Alert>):("")
                }
            </Stack>
            <Typography sx={{"textDecoration":"none",color:"black"}} mt={1} component={Link} variant='body1' to={'/signup'}>Create a new account</Typography>
        </Stack>
    </Stack>
    </>
  )
}
