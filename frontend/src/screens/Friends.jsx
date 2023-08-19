import React from 'react'
import { Navbar } from '../components/Navbar'
import {Stack,Box, Typography} from '@mui/material'
import { Leftbar } from '../components/Leftbar'

export const Friends = () => {
  return (
    <>
    <Navbar/>
        

            <Stack>
                <Box position={'fixed'}>
                    <Leftbar/>
                </Box>
            </Stack>


        <Stack flex={'1'}>
            
            <Typography variant='h4'>all the post regarding friends will be visible here</Typography>

        </Stack>
    </>
  )
}
