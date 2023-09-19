import { Box, Stack, Typography } from '@mui/material'
import React, { useContext } from 'react'
import catanimation from '../animations/login/catanimation.json'
import Lottie from 'lottie-react';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';

export const CaughtUpDisplay = () => {
  const {isDarkTheme}=useContext(ThemeContext)
  return (
    <Stack justifyContent={'center'} alignItems={"center"} >
                            
    <Box width={'10rem'}>
        <Lottie animationData={catanimation} />
    </Box>

    <Typography variant='body1' fontWeight={300}>You are all caught up!✅</Typography>
    <Typography variant='body1' fontWeight={300}>Follow more users for more content🚀</Typography>
</Stack>
  )
}
