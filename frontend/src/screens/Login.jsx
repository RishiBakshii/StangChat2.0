import { Box, Stack, TextField, Typography ,Button, Alert} from '@mui/material'
import React, { useState } from 'react'
import { Link,useNavigate} from 'react-router-dom'


export const Login = () => {
    const BASE_URL=process.env.REACT_APP_API_BASE_URL;
    const [alert,setAlert]=useState({message:"",severity:""})
    const [credentials,setCredentials]=useState({
        email:"",
        password:""
    })

    const navigate=useNavigate();

    const handleOnChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }

    const handleLoginSubmit=async()=>{
        const response=await fetch(`${BASE_URL}/login`,{
            method:"POST",
            headers:{
                "Content-Type":'application/json'
            },
            body:JSON.stringify({
                "email":credentials.email,
                "password":credentials.password
            })
        })
        
        const json=await response.json()

        if(response.ok){
            setAlert({message:json.message,severity:"success"})
            localStorage.setItem('authToken',json.authToken)
            setTimeout(()=>{
                navigate("/")
            },2000)
        }
        else{
            setAlert({message:json.message,severity:"warning"})
        }
    }

  return (
    <>
    <Stack bgcolor={'#edeef7'} width={'100vw'} justifyContent={"center"} alignItems={"center"} height={"100vh"}>
        
        <Stack bgcolor={'white'} borderRadius={".6rem"}  width={"40vw"} height={"40rem"} padding={2} justifyContent={'center'} alignItems={"center"}>

            <Typography variant='h3' color={"primary"} fontWeight={700}>Community Connect</Typography>

            <Stack mt={5} spacing={2} width={'60%'}>
                <TextField name='email' label="Email" variant="outlined" value={credentials.email}  onChange={handleOnChange}/>
                <TextField name='password' label="Password" variant="outlined" value={credentials.password} onChange={handleOnChange}/>
                <Button onClick={handleLoginSubmit} sx={{height:"3rem"}} variant='contained'>Login</Button>
                {
                    alert!==''?(
                        <>
                        <Alert onClick={()=>setAlert("")} variant='standard' severity={alert.severity}>{alert.message}</Alert>
                        </>
                    ):("")
                }
            </Stack>

            <Typography sx={{"textDecoration":"none"}} mt={2} component={Link} variant='p' to={'/signup'}>Create A New Account</Typography>

        </Stack>

    </Stack>
    </>
  )
}
