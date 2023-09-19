import Modal from '@mui/material/Modal';
import { Button, Stack, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LogoutUser } from '../api/auth';
import { useTheme } from '@emotion/react';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';
import { useContext } from 'react';


  
export const Logoutmodal = ({open,handleClose}) => {

    const theme=useTheme()
    const {isDarkTheme}=useContext(ThemeContext)
    const is400=useMediaQuery(theme.breakpoints.down("400"))

    const initiateLogout=async()=>{
        const islogoutTrue=await LogoutUser()
        if(islogoutTrue){
            navigate("/login")
        }
    }

    const navigate=useNavigate()

    const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
    const bgcolor=isDarkTheme?theme.palette.common.black:theme.palette.background.paper



  return (
        <Modal open={open} onClose={handleClose}>
    <Stack sx={{ position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',width: `${is400?'18rem':'25rem'}`,boxShadow: 24,p:4}} justifyContent={'flex-start'} alignItems={"flex-start"} bgcolor={bgcolor} color={color} spacing={3}>
    <Typography id="modal-modal-title" variant="h6" component="h2">Logout</Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        Are you sure you want to logout?☹️
    </Typography>
    <Stack direction={'row'} spacing={2}>
        <Button onClick={initiateLogout} variant='outlined'>Yes</Button>
        <Button onClick={handleClose} variant='contained'>No</Button>
    </Stack>

    </Stack>
    </Modal>
  )
}

