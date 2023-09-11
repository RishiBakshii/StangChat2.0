import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Button, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Send } from '@mui/icons-material'
import io from 'socket.io-client'
import { loggedInUserContext } from '../context/user/Usercontext'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import { BUCKET_URL } from '../envVariables'

export const GlobalChat = () => {

    const loggedInUser=useContext(loggedInUserContext)
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)

    const [messages, setMessages] = useState([]);

    const [messageTextFeild,setMessageTextFeild]=useState('')
    const socketRef = useRef(null);

    const chatContainerRef = useRef(null);


    const handleSendMessage=()=>{
        
        // for sending data
        const userdata={
            'profilePicture':loggedInUser.loggedInUser.profilePicture,
            'username':loggedInUser.loggedInUser.username,
            'message':messageTextFeild
        }
        socketRef.current.emit("chat-message",userdata)
        
        setMessageTextFeild("")
    }
    
    useEffect(() => {
        
        socketRef.current = io('http://localhost:5000');
        
        // on connection
        socketRef.current.on("connect",()=>{
            setGlobalAlertOpen({state:true,message:"Realtime connection established🚀"})
            socketRef.current.emit("join-room",{username:loggedInUser.loggedInUser.username})
        })
        
        // on receiving data
        socketRef.current.on("data",(data)=>{
            console.log(data)
            setMessages((prevMessages) => [...prevMessages,data]);
        })

        socketRef.current.on("disconnect",()=>{
            setGlobalAlertOpen({state:true,message:"You left the chatroom"})
        })
    
        return () => {
          socketRef.current.disconnect();
        };
      }, []);

      useEffect(() => {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [messages]);
    
  return (
    <>
    <Navbar/>
    <Stack direction={"row"} justifyContent={"space-between"} alignItems="flex-start">
            <Leftbar/>

            <Stack flex={4} p={1}>

                <Stack width={'100%'} height={'82vh'} sx={{overflowY:"scroll"}} ref={chatContainerRef}>

                    <Stack flex={1}>

                    </Stack>
                    
                    {
                        messages.map((message)=>{
                            return  <Stack m={1} p={1} spacing={2} bgcolor={'#cdefea'} borderRadius={'.4rem'}>
                                        
                                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                            <Avatar src={`${BUCKET_URL}/${message.profilePicture}`}></Avatar>
                                            <Typography variant='body2' color='text.secondary'>{message.username}</Typography>
                                        </Stack>

                                        <Typography color={'text.primary'}>
                                            {message.message}
                                        </Typography>
                                     </Stack>
                        })
                    }
                   

                </Stack>

                <Stack justifyContent={'center'} alignItems={'center'}>

                    <Stack direction={'row'} width={'100%'} spacing={1}>
                        <TextField onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && messageTextFeild.trim() !== '') {
                                handleSendMessage();
                            }}}
                        value={messageTextFeild} onChange={(e)=>setMessageTextFeild(e.target.value)} fullWidth placeholder='message...' 
                        
                        InputProps={{
                            endAdornment: <InputAdornment sx={{"fontSize":"small"}} position="start">{messageTextFeild.length}/1000</InputAdornment>,
                          }}
                        
                        ></TextField>
                        <Button variant='outlined' disabled={messageTextFeild.trim() === ''} onClick={handleSendMessage}><Send/></Button>
                    </Stack>

                </Stack>

            </Stack>

    </Stack>
    </>
  )
}
