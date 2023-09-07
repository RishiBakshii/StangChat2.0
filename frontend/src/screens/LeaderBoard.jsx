import React from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Stack, Typography } from '@mui/material'
import Lottie from 'lottie-react';
import underdevelopment from '../animations/underdevelopment.json'

export const LeaderBoard = () => {
  return (
    <>
    <Navbar/>
    <Leftbar/>

    <Stack flex={"1"} spacing={5}  justifyContent={'center'} alignItems={"center"} mt={2}>
        
        <Stack height={"80vh"} justifyContent={'center'} alignItems={'center'}>
        <Typography variant='h5' fontWeight={300}>You caught us🤭</Typography>
        <Typography variant='h5' fontWeight={300}>We are working on it</Typography>
        <Lottie animationData={underdevelopment}></Lottie>

        </Stack>

    </Stack>
    </>

  )
}
