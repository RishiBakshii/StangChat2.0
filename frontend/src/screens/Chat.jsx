import React, { useContext, useEffect, useState } from 'react'
import {Navbar} from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Box, Button, CircularProgress, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import Conversations from '../components/Conversations'
import { Send } from '@mui/icons-material'
import { ChatMessage } from '../components/ChatMessage'
import {getDatabase,ref,set,get,child,onValue,push} from 'firebase/database'
import { app } from '../firebase'
import { loggedInUserContext } from '../context/user/Usercontext'
import { BASE_URL, BUCKET_URL, SERVER_DOWN_MESSAGE } from '../envVariables'
import { handleApiResponse } from '../utils/common'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import { useNavigate } from 'react-router-dom'
import nochatanimation from '../animations/nochatanimation.json'
import nochatselected from '../animations/nochatselected.json'
import Lottie from 'lottie-react'
import theme from '../theme'
import { ThemeContext } from '../context/Theme/ThemeContext'



const db=getDatabase(app)

export const Chat = () => {

  const {isDarkTheme}=useContext(ThemeContext)
  const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
  const bgcolor=isDarkTheme?theme.palette.primary.customBlack:theme.palette.background.paper


  // user typing state
  const [isTyping, setIsTyping] = useState(false);


  const handleTyping = (e) => {
    if (e.target.value.trim() !== '') {
      setIsTyping(true);

      // After a few seconds of inactivity, set isTyping to false
      setTimeout(() => {
        setIsTyping(false);
      }, 2000); // Adjust the timeout duration as needed
    } else {
      setIsTyping(false);
    }
  };

  // breakpoints
  const LG=useMediaQuery(theme.breakpoints.down("lg"))
  const MD=useMediaQuery(theme.breakpoints.down("md"))

  // State variable to store the search query
  const [searchQuery, setSearchQuery] = useState('');


  // basic use states and contextr
  const navigate=useNavigate()
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const [loading,setLoading]=useState(false)
  const {loggedInUser}=useContext(loggedInUserContext)

  // conversation values between users
  const [messagesVal,setMessagesVal]=useState([])

  // user typed message value
  const [textFeildValue,setTextFeildValue]=useState('')

  // for updating the chatRoom (to indentify which user is selected)
  const [selectedChatRoom, setSelectedChatRoom] = useState({userid:'',username:'',profilePicture:''});

  // friends (to fetch the conversations list)
  const [friends,setFriends]=useState([])


  useEffect(() => {
    if(selectedChatRoom) {

      try{
        const sortedIds=[loggedInUser.userid,selectedChatRoom.userid].sort().join('')
        const chatRoomRef = ref(db, `messages/${sortedIds}`);
  
        onValue(chatRoomRef, (snapshot) => {
          console.log('chat history data',snapshot.val())
          setMessagesVal(snapshot.val())
        });
      }
      catch(error){
        console.log(error)
      }
    }
  }, [selectedChatRoom]);


  const handleSendMessage=()=>{

    try {
      const sortedIds=[loggedInUser.userid,selectedChatRoom.userid].sort().join('')


      if(isTyping){
        const typingStatus={
          userid:loggedInUser.userid,
          typing:true
        }

        const chatRoomRef = ref(db, `messages/${sortedIds}`);
        push(chatRoomRef, typingStatus);
      }

      setTextFeildValue("")
      const messageData={
        userid:loggedInUser.userid,
        name:loggedInUser.username,
        profilePicture:loggedInUser.profilePicture,
        message:textFeildValue,
        timestamp:new Date().getTime(),
    }
      const chatRoomRef = ref(db, `messages/${sortedIds}`);
      push(chatRoomRef, messageData);
    } catch (error) {
      console.log(error)
    }
    
  }


  // to load the conversations
  const getFriends=async()=>{
    setLoading(true)
    try {
      const response=await fetch(`${BASE_URL}/getfriends`,{
        method:"POST",
        credentials:"include",
        headers:{
          "Content-Type":'application/json'
        },
        body:JSON.stringify({
          'userid':loggedInUser.userid
        })
      })

      const result=await handleApiResponse(response)
      if (result.success) {
        setFriends(result.data);
  
        // Iterate through friends and set up listeners for chat rooms
        result.data.forEach((friend) => {
          // Create a chat room ID based on user combinations
          const chatRoomId = [loggedInUser.userid, friend.userid].sort().join("");
  
          // Set up a listener for the chat room
          const chatRoomRef = ref(db, `messages/${chatRoomId}`);
          onValue(chatRoomRef, (snapshot) => {
            // Handle new messages in this chat room
            const messages = snapshot.val();
            if (messages) {
              console.log('message from background listenre',messages)
              if(messages.userid===selectedChatRoom.userid){
                alert("same room message")
              }
              else{
                alert("another chat message")
              }
              
              console.log(messages)
            }
          });
        });
      } 
      else if(result.logout){
        setGlobalAlertOpen({state:true,message:result.message})
        navigate("/login")
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }

    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(loggedInUser.userid && friends.length === 0){
      getFriends()
    }
  },[loggedInUser.userid])

  return (
    <>
    <Navbar/>

    {/* parent stack */}
    <Stack direction={"row"} justifyContent={"space-between"}  alignItems="flex-start">
      <Leftbar/>

      {/* main tab - messaging */}
      <Stack flex={4} sx={{height:'calc(100vh - 4.5rem)'}}   p={1}>

        {/* chat display */}
        <Stack flex={4} sx={{overflowY:"scroll",bgcolor:bgcolor,color:color}}>
          {   
              selectedChatRoom===null?(
                <Box width={"10rem"} justifySelf={'center'} alignSelf={'center'}>
                  <Stack justifyContent={'center'} alignItems={'center'}>
                    <Lottie animationData={nochatselected}></Lottie>
                    <Typography mt={2}>Select a Conversation to start chatting✨</Typography>
                  </Stack>
                </Box>
              ):(

                messagesVal===null?(
                  <Box width={'10rem'} mt={2} justifySelf={'center'} alignSelf={'center'}>
                    <Stack justifyContent={'center'} alignItems={'center'}>
                    <Lottie animationData={nochatanimation}></Lottie>
                    <Typography textAlign={'center'}>Start a New Chat with {selectedChatRoom.username}✨</Typography>
                    <Avatar sx={{"width":"5rem",'height':"5rem"}} src={selectedChatRoom.profilePicture}></Avatar>
                    </Stack>
                  </Box>
                ):(messagesVal.length===0?("no conversation"):(
                  Object.values(messagesVal).map((data)=>{
                    return <ChatMessage profilePicture={`${BUCKET_URL}/${data.profilePicture}`} key={data.timestamp} message={data.message} own={loggedInUser.userid===data.userid}/>
                  })
                ))
              )
           
          }

        </Stack>

        {/* chat entry */}
        <Stack flex={.4} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'row'} width={"100%"}>
              <TextField fullWidth 
              onKeyDown={(e)=>{
                
                if (e.key === 'Enter' && textFeildValue.trim() !== ''){
                  handleSendMessage()
                  }
            }}
              
              placeholder='Write your message...' value={textFeildValue} onChange={(e)=>setTextFeildValue(e.target.value)}></TextField>
              <Button variant='outlined'  disabled={textFeildValue===''} onClick={handleSendMessage}><Send/></Button>
            </Stack>
        </Stack>


      </Stack>

      {/* conversations */}
      <Stack flex={LG?2:1.2} p={1} sx={{height:'calc(100vh - 4.5rem)',overflowY:'scroll'}} justifyContent={'flex-start'} alignContent={'flex-start'}>
        <TextField  placeholder='Search..' sx={{mt:2}} variant='outlined' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}></TextField>
        {
          loading?(<CircularProgress sx={{alignSelf:'center',justifySelf:"center",marginTop:'2rem'}}/>):(
            friends.length===0?("no frirends"):(
                friends.map((data)=>{
              return <Conversations bgColor={bgcolor} color={color}  key={data.userid} setSelectedChatRoom={setSelectedChatRoom} userid={data.userid} username={data.username} profilePicture={`${BUCKET_URL}/${data.profilePicture}`} location={data.location}/>
          })
          ))
        }
      </Stack>
    
    
    </Stack>
    </>
    
  )
}
