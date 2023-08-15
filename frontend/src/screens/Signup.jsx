import { Box, Stack, TextField, Typography ,Button, Alert} from '@mui/material'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const Signup = () => {

    const BASE_URL=process.env.REACT_APP_API_BASE_URL;

    const [credentials,setCredentials]=useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
        location:""
    })

    const [alert,setAlert]=useState({message:"",severity:""})

    const handleOnChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }

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
    </>
  )
}
