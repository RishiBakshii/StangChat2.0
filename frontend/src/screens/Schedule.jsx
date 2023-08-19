import React from 'react'
import { Navbar } from '../components/Navbar'
import {Stack,Box} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { TimeLine } from '../components/Timeline'

export const Schedule = () => {
  return (
    <>
    <Navbar/>
        <Stack flex={"10%"}>
                <Box position={'fixed'} width={'100%'}>
                    <Leftbar/>
                </Box>
            </Stack>

        <Stack flex={'100%'} justifyContent={'center'} alignItems={'center'}>
            <TimeLine/>

        </Stack>
    </>
  )
}
