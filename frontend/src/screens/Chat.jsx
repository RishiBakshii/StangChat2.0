import React, { useState } from 'react'
import {Navbar} from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Button, Stack, TextField, Typography } from '@mui/material'
import Conversations from '../components/Conversations'
import { Send } from '@mui/icons-material'
import { ChatMessage } from '../components/ChatMessage'

export const Chat = () => {

  const [message,setMessage]=useState('')

  return (
    <>
    <Navbar/>

    {/* parent stack */}
    <Stack direction={"row"} justifyContent={"space-between"} alignItems="flex-start">
      <Leftbar/>

      {/* main tab - messaging */}
      <Stack flex={4}  sx={{height:'calc(100vh - 4.5rem)'}} p={1}>

        {/* chat display */}
        <Stack flex={4}>
          <ChatMessage/>
          <ChatMessage own={true}/>
          <ChatMessage/>
          <ChatMessage/>
        </Stack>

        {/* chat entry */}
        <Stack flex={.4} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'row'} width={"100%"}>
              <TextField fullWidth placeholder='Write your message...' value={message} onChange={(e)=>setMessage(e.target.value)}></TextField>
              <Button variant='outlined' disabled={message===''}><Send/></Button>
            </Stack>
        </Stack>


      </Stack>

      {/* conversations */}
      <Stack flex={1.2} bgcolor={'green'} justifyContent={'flex-start'} alignContent={'flex-start'}>
          <Conversations/>
          <Conversations/>
          <Conversations/>
      </Stack>
    
    
    </Stack>
    </>
    
  )
}
