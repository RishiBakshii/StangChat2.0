import React, { useContext, useEffect, useRef, useState } from 'react'
import {Navbar} from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import Conversations from '../components/Conversations'
import { GifBox, Send } from '@mui/icons-material'
import { ChatMessage } from '../components/ChatMessage'
import {getDatabase,ref,set,get,child,onValue,push, onChildAdded, off} from 'firebase/database'
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
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import AttachmentIcon from '@mui/icons-material/Attachment';
import GifBoxIcon from '@mui/icons-material/GifBox';



const db=getDatabase(app)

export const Chat = () => {


  const {isDarkTheme}=useContext(ThemeContext)
  const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
  const bgcolor=isDarkTheme?theme.palette.primary.customBlack:theme.palette.background.paper

  // chat container ref
  const chatContainerRef = useRef(null);

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

  const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);

  // conversation values between users
  const [messagesVal,setMessagesVal]=useState([])

  // user typed message value
  const [textFeildValue,setTextFeildValue]=useState('')

  // for updating the chatRoom (to indentify which user is selected)
  const [selectedChatRoom, setSelectedChatRoom] = useState({userid:'',username:'',profilePicture:''});

  // friends (to fetch the conversations list)
  const [friends,setFriends]=useState([])

  // state for managing and setting up a default chat
  const [defaultChatSet, setDefaultChatSet] = useState(false);

  const [initialDataSync,setInitialDatasync]=useState(false)


  const [unreadMessages, setUnreadMessages] = useState({});



  // listens for new value in selected chat
  useEffect(() => {
    if(selectedChatRoom) {
      try{
        const sortedId=[loggedInUser.userid,selectedChatRoom.userid].sort().join('')
        const chatRoomRef = ref(db, `messages/${sortedId}`);
        
        const unsubsribe=onValue(chatRoomRef, (snapshot) => {
          setMessagesVal(snapshot.val())
        });
        return () => {
          unsubsribe()
        };
      }

      catch(error){
        console.log(error)
      }
    }
  }, [selectedChatRoom]);


  // handles the message send
  const handleSendMessage=async()=>{
    const sortedids=[loggedInUser.userid,selectedChatRoom.userid].sort().join('')

    const userRef=ref(db,'users')

    try {

      const isSenderId=await get(child(userRef,loggedInUser.userid))
      const isReceiverId=await get(child(userRef,selectedChatRoom.userid))

      if (!isSenderId.exists()){
        await set(ref(db,`users/${loggedInUser.userid}/unreadMessages`),{})
      }
      if (!isReceiverId.exists()){
        set(ref(db,`users/${selectedChatRoom.userid}/unreadMessages`),{})
      }

      const messageData={
        userid:loggedInUser.userid,
        receiverid:selectedChatRoom.userid,
        name:loggedInUser.username,
        profilePicture:loggedInUser.profilePicture,
        message:textFeildValue,
        timestamp:new Date().getTime(),
        roomid:sortedids
    }

      const chatRoomRef = ref(db, `messages/${sortedids}`);
      push(chatRoomRef, messageData);
    } catch (error) {
      console.log(error)
    }
    finally{
      setTextFeildValue("")
    }
    
  }

  // for marking the messages as read
  const markMessagesAsRead = async (senderUserID, recipientUserID) => {
    const senderRef = ref(db, `users/${senderUserID}/unreadMessages/${recipientUserID}`);
    const recipientRef = ref(db, `users/${recipientUserID}/unreadMessages/${senderUserID}`);
  
    const senderSnapshot = await get(senderRef);
    const recipientSnapshot = await get(recipientRef);
  
    if (senderSnapshot.exists()) {
      await set(senderRef, 0);
    }
  
    if (recipientSnapshot.exists()) {
      await set(recipientRef, 0);
    }
  };
  

  // for updating the unread messages count
  const updateUnreadMessages=async(senderUserID,recipientUserID)=>{
    const recipientRef = ref(db, `users/${recipientUserID}/unreadMessages/${senderUserID}`);
    const recipientSnapshot = await get(recipientRef);
    const recipientUnreadCount = recipientSnapshot.exists() ? recipientSnapshot.val()+1:0;
    await set(recipientRef, recipientUnreadCount);
  }

  // for handling realtime updates
  const handleBackgroundMessages=async()=>{
    const chatRoomListeners=[]
    if (friends.length > 0 && defaultChatSet) {
      console.log("starting the listener function...")
      const ACTIVE_CHAT_ROOM = [loggedInUser.userid, selectedChatRoom.userid].sort().join("");

      friends.forEach((friend) => {
        const chatRoomId = [loggedInUser.userid, friend.userid].sort().join("");
        const chatRoomRef = ref(db, `messages/${chatRoomId}`);
  
        const listener = onChildAdded(chatRoomRef, (snapshot) => {
          const message = snapshot.val();
          if (message) {  
            if (message.roomid === ACTIVE_CHAT_ROOM && message.userid !== loggedInUser.userid) {
              console.log("same room");
            }
            else if(message.userid !== loggedInUser.userid && selectedChatRoom.userid) {
                console.log(`received new message from ${message.name}`);
            }
          }
        });
        chatRoomListeners.push({ chatRoomId, listener });
      });
      setInitialDatasync(true)
      console.log('added listeners succesfully✅')
      
      return () => {
        chatRoomListeners.forEach(({ chatRoomId, listener }) => {
          const chatRoomRef = ref(db, `messages/${chatRoomId}`);
          off(chatRoomRef,'child_added',listener);
        });
      };
    }
    else{
      alert("no data")
    }

  }
  
  // to load the friends data (conversation list)
  const fetchInitialData=async()=>{
    console.log("fetching friends data...")
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

        setFriends((prevFriends) => {
          const updatedFriends = [...prevFriends, ...result.data]; 
          return updatedFriends;
        })

        console.log("friends data loaded...")
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
      fetchInitialData()
    }
  },[loggedInUser.userid])



  // to check if the friends data is loaded
  useEffect(()=>{
    if(friends.length>0){
      console.log("friends data has loaded length is : ",friends.length)
      updateDefaultData()
    }
  },[friends])


  const updateDefaultData=()=>{
    setSelectedChatRoom({
      userid:friends[0].userid,
      username:friends[0].username,
      profilePicture:`${BUCKET_URL}/${friends[0].profilePicture}`,
    })
    console.log('default chat has been set',selectedChatRoom)
    setHasInitialDataLoaded(true)
    setDefaultChatSet(true) 

  }

  // useEffect(()=>{

  //   if(hasInitialDataLoaded){
  //     setDefaultChatSet(true)
  //   }

  // },[hasInitialDataLoaded])

  useEffect(() => {
    if(hasInitialDataLoaded){

      console.log('initial data has been loaded initiating adding listerner on each chat processs...')

      const inititebackgroundcheck=async()=>{
        await handleBackgroundMessages()
      }
      inititebackgroundcheck()
    }
    }, [hasInitialDataLoaded,defaultChatSet]);



  // handles the bottom scroll on each new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messagesVal]);

  return (
    <>
    <Navbar/>

    {/* parent stack */}
    <Stack direction={"row"} justifyContent={"space-between"}  alignItems="flex-start">
      <Leftbar/>

      {/* main tab - messaging */}
      <Stack flex={4} sx={{height:'calc(100vh - 4.5rem)'}}   p={1}>

        {/* chat display */}
        <Stack flex={4} sx={{overflowY:"scroll",bgcolor:bgcolor,color:color}} ref={chatContainerRef}>

          {/* chat bar */}
          <Stack direction={'row'}  sx={{bgcolor:theme.palette.primary.main,color:"white",transition:".8s"}} p={2} height={'4rfem'} borderRadius={".4rem"} justifyContent={'space-between'}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Avatar src={selectedChatRoom.profilePicture}/>
            <Typography variant='h6'>
              {selectedChatRoom.username}
            </Typography>
            </Stack>

            <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={2}>
              <IconButton><CallIcon sx={{"color":"white"}}/></IconButton>
              <IconButton><VideocamIcon sx={{"color":"white"}}/></IconButton>
            </Stack>

          </Stack>


          {   
              selectedChatRoom.userid==='' || selectedChatRoom.profilePicture==='' || selectedChatRoom.username===''?(
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
              {
                selectedChatRoom.userid===''?(""):(
                  <>
                                <TextField fullWidth InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton>
            <AttachmentIcon />
            </IconButton>
            <IconButton>
              <GifBox/>
            </IconButton>
          </InputAdornment>
        ),
      }}
              onKeyDown={(e)=>{
                
                if (e.key === 'Enter' && textFeildValue.trim() !== ''){
                  handleSendMessage()
                  }
            }}
              
              placeholder='Write your message...' value={textFeildValue} onChange={(e)=>setTextFeildValue(e.target.value)}></TextField>

              <Button variant='outlined'  disabled={textFeildValue===''} onClick={handleSendMessage}><Send/></Button></>

                )
              }

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
              return <Conversations key={data.userid} bgColor={bgcolor} color={color}   setSelectedChatRoom={setSelectedChatRoom} userid={data.userid} username={data.username} profilePicture={`${BUCKET_URL}/${data.profilePicture}`} location={data.location}/>
          })
          ))
        }
      </Stack>
    
    
    </Stack>
    </>
    
  )
}
