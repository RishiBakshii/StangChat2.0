import React, { useContext, useEffect, useRef, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Box, Button,InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Send } from '@mui/icons-material'
import io from 'socket.io-client'
import { loggedInUserContext } from '../context/user/Usercontext'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import { BASE_URL, BUCKET_URL } from '../envVariables'
import PersonIcon from '@mui/icons-material/Person';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';

import { Link } from 'react-router-dom'

export const GlobalChat = () => {

    const loggedInUser=useContext(loggedInUserContext)
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
    const [connectedUsersCount, setConnectedUsersCount] = useState(0);

    const [messages, setMessages] = useState([]);

    const [messageTextFeild,setMessageTextFeild]=useState('')
    const socketRef = useRef(null);

    const chatContainerRef = useRef(null);
    const {isDarkTheme}=useContext(ThemeContext)
    const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
    const bgcolor=isDarkTheme?theme.palette.common.black:theme.palette.background.paper


    const handleSendMessage=()=>{
        
        // for sending data
        const data={
            'type':"chat-message",
            'profilePicture':loggedInUser.loggedInUser.profilePicture,
            'username':loggedInUser.loggedInUser.username,
            'message':messageTextFeild
        }

        socketRef.current.emit("chat-message",data)
        
        setMessageTextFeild("")
    }
    
    useEffect(() => {
        
        socketRef.current = io(`${BASE_URL}`);
        
        // on connection
        socketRef.current.on("connect",()=>{
            socketRef.current.emit("join-room",{"type":"user-joined","username":loggedInUser.loggedInUser.username,
            "profilePicture":loggedInUser.loggedInUser.profilePicture
        })
            setGlobalAlertOpen({state:true,message:"Realtime connection established🚀"})
        })
        
        // on receiving data
        socketRef.current.on("data",(data)=>{
            setMessages((prevMessages) => [...prevMessages,data]);
        })

        
        socketRef.current.on("user-count",(data)=>{
            setConnectedUsersCount(data.count)
        })
        
        socketRef.current.on("disconnect",(reason)=>{
            console.log("socket disconnected",reason)

            const data={
                'type':"chat-message",
                'profilePicture':loggedInUser.loggedInUser.profilePicture,
                'username':loggedInUser.loggedInUser.username,
            }
            socketRef.current.emit("user-left",data)

            socketRef.current.disconnect();
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
                    
                    {
                        messages.map((message)=>{
                            return  <Stack m={1} p={1} spacing={2} bgcolor={bgcolor} color={color} borderRadius={'.4rem'}>
                                        
                                        {message.type==='user-joined'?(
                                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                                 <Avatar component={Link} to={`/profile/${message.username}`} src={`${BUCKET_URL}/${message.profilePicture}`}></Avatar>
                                                <Typography>{loggedInUser.loggedInUser.username ===message.username?("you"):(message.username)} joined</Typography>
                                            </Stack>
                                        ):message.type==='user-left'?(
                                            <Stack direction={'row'} bgcolor={'red'} height={'9rem'} spacing={1} alignItems={'center'}>
                                                        <Avatar component={Link} to={`/profile/${message.username}`} src={`${BUCKET_URL}/${message.profilePicture}`}></Avatar>
                                                        <Typography>{loggedInUser.loggedInUser.username ===message.username?("you"):(message.username)} left</Typography>
                                                </Stack>
                                        ):(
                                            <>
                                            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                                                    <Avatar component={Link} to={`/profile/${message.username}`} src={`${BUCKET_URL}/${message.profilePicture}`}></Avatar>
                                                    <Typography variant='body2' color={`${isDarkTheme?theme.palette.common.white:'text.secondary'}`}>{message.username}</Typography>
                                            </Stack>

                                            <Typography sx={{color:color}}>
                                                {message.message}
                                            </Typography>
                                        </>
                                        )}
                                        
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
                        value={messageTextFeild} onChange={(e)=>setMessageTextFeild(e.target.value)} fullWidth placeholder='Type your Message...' 
                        
                        InputProps={{style:{color},
                            endAdornment: <InputAdornment sx={{"fontSize":"small"}} position="start">{messageTextFeild.length}/1000</InputAdornment>,
                          }}
                        
                        ></TextField>
                        <Button variant='outlined' disabled={messageTextFeild.trim() === ''} onClick={handleSendMessage}><Send/></Button>
                    </Stack>

                </Stack>

            </Stack>

            <Stack p={1} flex={.1} spacing={1} direction={'row'} justifyContent={'center'} alignItems={'center'} mt={1} position={'absolute'} right={0}>
                <Box>
                    <PersonIcon sx={{color:"lightslategrey"}}/>
                </Box>
                <Box>
                    <Typography>{connectedUsersCount}</Typography>
                </Box>
            </Stack>

    </Stack>
    </>
  )
}
