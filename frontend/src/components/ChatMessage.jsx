import { Avatar, Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import theme from '../theme'


export const ChatMessage = ({own,username,message,profilePicture,mobile,type}) => {

  const is480=useMediaQuery(theme.breakpoints.down("480"))

  const gifWidth=is480?"13rem":''
  // const gifHeight=''

  return (
    <>
    
    <Stack p={1} alignSelf={own?"flex-end":''} mt={1}>
        <Stack direction={'row'} spacing={1}>
                <Avatar sx={{width:mobile?"1.6rem":'2rem',height:mobile?"1.6rem":'2rem'}} src={profilePicture}></Avatar>
                <Stack borderRadius={'.6rem'} p={1} maxWidth={'400px'} bgcolor={theme.palette.primary.main}>
                  {
                    type==='gif'?(
                      <video style={{width:gifWidth,height:gifWidth}} loop autoPlay src={message} alt="" />
                    ):(
                      <Typography color={'white'}>{message}</Typography>
                    )
                  }
                </Stack>
        </Stack>
        
        {/* <Typography alignSelf={own?'flex-end':""} variant='body2' color="text.secondary">seen</Typography> */}
    </Stack>
    </>
  )
}
