import React from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import {Box,Stack,Grid} from '@mui/material'
import { Feed } from '../components/Feed'
import { Rightbar } from '../components/Rightbar'
import { Main } from './Home'
import Facultycard from '../components/Facultycard'

export const Aboutfaculty = () => {
  return (
    <>
    <Navbar/>
    <Main>

        <Stack direction={'row'} justifyContent={'space-between'}>

            <Stack flex={"10%"}>
                <Box position={'fixed'} width={'100%'}>
                    <Leftbar/>
                </Box>
            </Stack>

            <Stack flex={"70%"}>

                <Grid padding={2} container justifyContent={'center'} alignContent={'center'} rowGap={5} columnGap={3}>
                    <Facultycard name={'Sumit Negi'} subject={'C programming'} about={"Often a card allow users to interact with the entirety of its surface to trigger its main action, be it an expansion, a link to another screen or some other behavior. The action area of the card can be specified by wrapping its contents in a CardActionArea component."} img={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtNMoVZ1nvONFxWSn4LM3eGMH99d49_FtBoA&usqp=CAU"}/>
                    <Facultycard name={'Sumit Negi'} subject={'C programming'} about={"Often a card allow users to interact with the entirety of its surface to trigger its main action, be it an expansion, a link to another screen or some other behavior. The action area of the card can be specified by wrapping its contents in a CardActionArea component."} img={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtNMoVZ1nvONFxWSn4LM3eGMH99d49_FtBoA&usqp=CAU"}/>
                    <Facultycard name={'Sumit Negi'} subject={'C programming'} about={"Often a card allow users to interact with the entirety of its surface to trigger its main action, be it an expansion, a link to another screen or some other behavior. The action area of the card can be specified by wrapping its contents in a CardActionArea component."} img={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtNMoVZ1nvONFxWSn4LM3eGMH99d49_FtBoA&usqp=CAU"}/>
                    <Facultycard name={'Sumit Negi'} subject={'C programming'} about={"Often a card allow users to interact with the entirety of its surface to trigger its main action, be it an expansion, a link to another screen or some other behavior. The action area of the card can be specified by wrapping its contents in a CardActionArea component."} img={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtNMoVZ1nvONFxWSn4LM3eGMH99d49_FtBoA&usqp=CAU"}/>
                    <Facultycard name={'Sumit Negi'} subject={'C programming'} about={"Often a card allow users to interact with the entirety of its surface to trigger its main action, be it an expansion, a link to another screen or some other behavior. The action area of the card can be specified by wrapping its contents in a CardActionArea component."} img={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtNMoVZ1nvONFxWSn4LM3eGMH99d49_FtBoA&usqp=CAU"}/>
                </Grid>

                

            </Stack>



        </Stack>

    </Main>
    
    </>
  )
}
