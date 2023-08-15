import React from 'react'
import { Navbar } from '../components/Navbar'
import { Main, Parentstack } from './Home'
import {Stack,Box, Typography} from '@mui/material'
import { Leftbar } from '../components/Leftbar'

export const Friends = () => {
  return (
    <>
    <Navbar/>
    <Main>
        
        <Parentstack>

            <Stack>
                <Box position={'fixed'}>
                    <Leftbar/>
                </Box>
            </Stack>

        </Parentstack>

        <Stack flex={'1'}>
            
            <Typography variant='h4'>all the post regarding friends will be visible here</Typography>

        </Stack>

    </Main>
    </>
  )
}
