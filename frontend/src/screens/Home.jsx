import React from 'react'
import { Navbar } from '../components/Navbar'
import {Box,Stack,styled} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Feed } from '../components/Feed'
import { Rightbar } from '../components/Rightbar'


export const Main=styled("main")(({theme})=>({
    width:"100",
    padding:"1rem 1rem"
}))

export const Parentstack=styled(Stack)(({theme})=>({
    justifyContent:"space-between",
    flexDirection:"row"
}))

export const Home = () => {

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

            <Stack flex={"40%"} spacing={5} justifyContent={'center'} alignItems={"center"}>
                <Feed/>
            </Stack>  
            
            <Stack flex={"20%"}  justifyContent={'flex-start'} alignItems={'center'}>
                <Box position={'fixed'}>
                    <Rightbar/>
                </Box>
            </Stack>
           
        </Parentstack>

    </Main>
    

    </>
  )
}
