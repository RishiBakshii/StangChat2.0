import Modal from '@mui/material/Modal';
import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/auth';
import { useTheme } from '@emotion/react';

  
export const Logoutmodal = ({open,handleClose}) => {

    const theme=useTheme()
    const is400=useMediaQuery(theme.breakpoints.down("400"))

    const initiateLogout=async()=>{
        const islogoutTrue=await logoutUser()
        if(islogoutTrue){
            navigate("/login")
        }
    }


    const navigate=useNavigate()


  return (
        <Modal open={open} onClose={handleClose}>
    <Stack sx={{ position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',width: `${is400?'18rem':'25rem'}`,boxShadow: 24,p:4}} justifyContent={'flex-start'} alignItems={"flex-start"} bgcolor={'white'} spacing={3}>
    <Typography id="modal-modal-title" variant="h6" component="h2">Logout</Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Are you sure you want to logout?🤫
    </Typography>
    <Stack direction={'row'} spacing={2}>
        <Button onClick={initiateLogout} variant='outlined'>Yes</Button>
        <Button onClick={handleClose} variant='contained'>No</Button>
    </Stack>

    </Stack>
    </Modal>
  )
}

