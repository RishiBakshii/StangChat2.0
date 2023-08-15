import React from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Main, Parentstack } from './Home'
import {Stack,Box} from '@mui/material'

export const Settings = () => {
  return (
    <>
    <Navbar/>

    <Main>

        <Parentstack>

        <Stack flex={"10%"}>
                <Box position={'fixed'} width={'100%'}>
                    <Leftbar/>
                </Box>
            </Stack>
            

        </Parentstack>


    </Main>
    </>
  )
}
