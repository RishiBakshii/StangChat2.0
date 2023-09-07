import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import catanimation from '../animations/login/catanimation.json'
import Lottie from 'lottie-react';

export const CaughtUpDisplay = () => {
  return (
    <Stack justifyContent={'center'} alignItems={"center"}>
                            
    <Box width={'10rem'}>
        <Lottie animationData={catanimation} />
    </Box>

    <Typography variant='body1' fontWeight={300}>You are all caught up!✅</Typography>
    <Typography variant='body1' fontWeight={300}>Follow more users for more content🚀</Typography>
</Stack>
  )
}
