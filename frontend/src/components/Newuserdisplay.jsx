import React from 'react'
import Lottie from 'lottie-react';
import welcomecat from '../animations/login/welcomecat.json'
import { Box, Stack, Typography } from '@mui/material';

export const Newuserdisplay = () => {
  return (
    <Stack justifyContent={'center'} alignItems={"center"}>
                            
        <Box width={'30rem'}>
            <Lottie animationData={welcomecat} />
        </Box>

        <Typography variant='body1' fontWeight={300}>hmm! you seem new🤔</Typography>
        <Typography variant='body1' fontWeight={300}>Follow some people to see their posts</Typography>
    
    </Stack>
  )
}
