import React from 'react'
import { Navbar } from '../components/Navbar'
import { Main, Parentstack } from './Home'
import {Stack,Box, Avatar, Typography, Button} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Feed } from '../components/Feed'
import { Rightbar } from '../components/Rightbar'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useParams } from 'react-router-dom'

export const Profile = () => {

  const {username}=useParams()
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

            <Stack flex={"1"} spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>

                <Stack padding={'1.5rem'} bgcolor={'#f0f0f0'} borderRadius={'.6rem'} width={'50%'} height={"40rem"} justifyContent={'flex-start'} alignItems={'flex-start'}>

                  {/* name and avatar */}
                  <Stack spacing={3}>
                      <Avatar sx={{width:"10rem",height:"10rem"}} alt="Cindy Baker" src="https://mui.com/static/images/avatar/2.jpg" />
                      <Stack direction={'row'} alignItems={'center'} spacing={2}>
                          <Typography variant='h4' fontWeight={300}>{username}</Typography>
                          <Typography variant='h6' fontWeight={300}>He/Him</Typography>
                      </Stack>
                  </Stack>

                  {/* about */}
                  <Stack mt={2}>
                      <Typography variant='body1'>My name is RishiBakshi and i am data a scientist currently pursuing Bca at IMS Noida 1st year but besides that i am into Data Science since 2+ years.</Typography>
                  </Stack>

                  {/* social following and followers */}
                  <Stack direction={'row'} spacing={2} mt={2}>
                    <Typography variant='h6' fontWeight={300}>1k Followers</Typography>
                    <Typography variant='h6' fontWeight={300}>698 Following</Typography>
                  </Stack>


                  {/* tag and location status */}
                  <Stack mt={3} spacing={.3}>
                    <Typography variant='body1'>Teacher</Typography>
                    <Typography variant='body1'>Vasundhara</Typography>
                    <Button variant='text' startIcon={<LinkedInIcon/>}>JohnDoe</Button>
                  </Stack>

                </Stack>
            </Stack>  
        </Parentstack>

    </Main>
    </>
  )
}
