import React from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Button, Stack, Typography } from '@mui/material'
import { Rightbar } from '../components/Rightbar'
import { LocationCityRounded } from '@mui/icons-material'
import { Link } from 'react-router-dom'

export const Search = () => {
  return (
    <>
    <Navbar/>
    <Stack direction={"row"} spacing={2}>
        <Leftbar/>
      
        <Stack flex={4} p={2} justifyContent={'flex-start'} alignItems={'flex-start'}>

                <Stack spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>

                <Stack direction={'row'} alignSelf={'center'} width={"40rem"} justifyContent={'space-between'}>
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <Avatar component={Link} to={``} sx={{"width":"10rem",'height':"10rem"}}></Avatar>
                    <Stack>
                    <Typography component={Link} to={``} sx={{"textDecoration":"none",color:"black"}} variant='h5' fontWeight={300}>username</Typography>
                    <Typography variant='body1' fontWeight={300}>location</Typography>
                    </Stack>
                  </Stack>
                  <Stack justifyContent={'center'}>

                   <Button variant='contained'>Follow</Button>
                  </Stack>
                </Stack>
              </Stack>

         </Stack>
    </Stack>  
        </>

  
  )
}
