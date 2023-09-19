import React from 'react'
import Lottie from 'lottie-react';
import welcomecat from '../animations/login/welcomecat.json'
import { Box, Stack, Typography, useMediaQuery } from '@mui/material';
import theme from '../theme';


export const Newuserdisplay = () => {

  const is480=useMediaQuery(theme.breakpoints.down("480"))

  return (
    <Stack justifyContent={'center'} alignItems={"center"}>
                            
        <Box width={`${is480?'20rem':"30rem"}`}>
            <Lottie animationData={welcomecat} />
        </Box>

        <Typography variant='body1' fontWeight={300}>hmm! you seem new🤔</Typography>
        <Typography variant='body1' fontWeight={300}>Follow some people to see their posts</Typography>
    
    </Stack>
  )
}
