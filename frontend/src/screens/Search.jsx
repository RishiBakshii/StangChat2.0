import React from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Stack } from '@mui/material'

export const Search = () => {
  return (
    <>
    <Navbar/>
    <Leftbar/>

    <Stack bgcolor={'red'} spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>

        <Stack bgcolor={'green'} alignSelf={'flex-start'}>
            <Avatar></Avatar>
        </Stack>
    </Stack>

    </>
  )
}
