import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import theme from '../theme'

export const ChatMessage = ({own,username,message,profilePicture,}) => {
  return (
    <>
    
    <Stack p={1} alignSelf={own?"flex-end":''} mt={1}>
        <Stack direction={'row'} spacing={1}>
                <Avatar src={profilePicture}></Avatar>
                <Stack borderRadius={'.6rem'} p={1} maxWidth={'400px'} bgcolor={theme.palette.primary.main}>
                    <Typography color={'white'}>{message}</Typography>
                </Stack>
        </Stack>
        
        <Typography variant='body2' color="text.secondary">seen</Typography>
    </Stack>
    </>
  )
}
