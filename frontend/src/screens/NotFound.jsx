import { Button, Stack, Typography } from '@mui/material'
import React from 'react'
import Lottie from 'lottie-react';
import pagenotfoundanimation from '../animations/pagenotfoundanimation.json'
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <>
    
    <Stack width={"100vw"} height={"100vh"} justifyContent={'center'} alignItems={'center'}>
        <Stack width={'20rem'} height={'20rem'}>
            <Lottie loop={false}  animationData={pagenotfoundanimation}/>
        </Stack>

        <Typography gutterBottom variant='h5'>
            You landed on a wrong page!👽
        </Typography> 

        <Typography variant='body1'>
          StangChat✨ <Link to={'/'}><Button variant='outlined'>Go Back</Button></Link>
          </Typography>   
    </Stack>

    </>
  )
}
