import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Box, Button, Stack } from '@mui/material';
import theme from '../theme';
import { useContext } from 'react';
import { ThemeContext } from '../context/Theme/ThemeContext';


export const NotificationHelperModal=({open,handleClose})=>{

    const {isDarkTheme}=useContext(ThemeContext) 
    
    const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
      const bgcolor=isDarkTheme?theme.palette.common.black:theme.palette.background.paper

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        boxShadow: 24,
        padding:3,
        borderRadius:".4rem",
        [theme.breakpoints.down('480')]:{
          width:'18rem'
        },
        color:color,
        bgcolor:bgcolor
      };

     

  return (
    <div>
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack sx={style} spacing={2}>
        <Typography id="modal-modal-title" variant="h5" fontWeight={300}>
          TroubleShoot Notifications
        </Typography>


        <Stack bgcolor={'red'}>
            <video controls src="https://stangchat-user-data.s3.ap-south-1.amazonaws.com/notificationsHelper/notificationsHelper.mp4"></video>
        </Stack>
      </Stack>
    </Modal>
  </div>
  );
}