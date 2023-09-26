import React, { useContext, useEffect, useRef, useState } from 'react'
import {Navbar} from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Avatar, Badge, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import Conversations from '../components/Conversations'
import { GifBox, Send} from '@mui/icons-material'
import { ChatMessage } from '../components/ChatMessage'
import {getDatabase,ref,set,get,child,onValue,push, onChildAdded, off} from 'firebase/database'
import { app } from '../firebase'
import { loggedInUserContext } from '../context/user/Usercontext'
import { BASE_URL, BUCKET_URL, GIPHY_API_KEY, SERVER_DOWN_MESSAGE } from '../envVariables'
import { handleApiResponse, send_push_notification } from '../utils/common'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import { Link, useNavigate } from 'react-router-dom'
import nochatanimation from '../animations/nochatanimation.json'
import nochatselected from '../animations/nochatselected.json'
import Lottie from 'lottie-react'
import theme from '../theme'
import { ThemeContext } from '../context/Theme/ThemeContext'
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ReactGiphySearchbox from 'react-giphy-searchbox'


// getting the database instance here
const db=getDatabase(app)

export const Chat = () => {

  // reference of modal contianer
  const modalContainerRef = useRef(null);


  // dark theme context
  const {isDarkTheme}=useContext(ThemeContext)

  // initializing dynamic color varibales based on theme
  const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
  const bgcolor=isDarkTheme?theme.palette.primary.customBlack:theme.palette.background.paper

  // chat container ref
  const chatContainerRef = useRef(null);

  // breakpoints
  const LG=useMediaQuery(theme.breakpoints.down("lg"))
  const MD=useMediaQuery(theme.breakpoints.down("md"))
  const SM=useMediaQuery(theme.breakpoints.down("sm"))
  const is480=useMediaQuery(theme.breakpoints.down("480"))
  const is380=useMediaQuery(theme.breakpoints.down("380"))

  // State variable to store the search query
  const [searchQuery, setSearchQuery] = useState('');

  // basic states and hooks
  const navigate=useNavigate()
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const [loading,setLoading]=useState(false)
  const {loggedInUser}=useContext(loggedInUserContext)

  // state for inidicating friends data is loaded or not
  const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);

  // this state holds the messaging/conversation values between users
  const [messagesVal,setMessagesVal]=useState([])

  // user typed message value
  const [textFeildValue,setTextFeildValue]=useState('')

  // for updating the chatRoom (to indentify which user is selected)
  const [selectedChatRoom, setSelectedChatRoom] = useState({userid:'',username:'',profilePicture:''});

  // friends data state (to fetch the conversations list)
  const [friends,setFriends]=useState([])

  // state for managing and setting up a default chat
  const [defaultChatSet, setDefaultChatSet] = useState(false);

  // sorted chats based on unread messages count
  const [sortedChats,setSortedChats]=useState([])

  // holds the unread message counts with respect to each friend ID
  const [unreadMessageCounts, setUnreadMessageCounts] = useState([]);

  // gifphy modal open state
  const [isGiphyModalOpen,setIsGiphyModalOpen]=useState(false)


  // mobile view dms slider
  const [isDmsOpen,setIsDmsOpen]=useState(false)

  const totalUnreadMessages = Object.values(unreadMessageCounts).reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0
  );

  useEffect(() => {
    const filtered = friends.filter((friend) =>
      friend.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFriends(filtered);
  }, [searchQuery]);


  // listens for new value in selected chat
  useEffect(() => {
    if(selectedChatRoom) {
      setIsDmsOpen(false)
      try{
        const sortedId=[loggedInUser.userid,selectedChatRoom.userid].sort().join('')
        const chatRoomRef = ref(db, `messages/${sortedId}`);

        const timestamp = new Date().getTime()

        const demo=async()=>{
          const chatRoomLastInteractionRef = ref(db, `chatRoomLastInteractions/${sortedId}/lastInteractionTimestamp`);
          await set(chatRoomLastInteractionRef, timestamp);
        }

        demo()

        // console.log(selectedChatRoom.fcmToken)
        
        const unsubsribe=onValue(chatRoomRef, (snapshot) => {
          const messages=snapshot.val()
          setMessagesVal(messages)
          markMessagesAsRead(selectedChatRoom.userid,loggedInUser.userid)
          
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
  const handleSendMessage=async(gif,gifurl)=>{
    const sortedids=[loggedInUser.userid,selectedChatRoom.userid].sort().join('')

    const userRef=ref(db,'users')

    try {
      const isSenderId=await get(child(userRef,loggedInUser.userid))
      const isReceiverId=await get(child(userRef,selectedChatRoom.userid))

      if (!isSenderId.exists()){
        await set(ref(db,`users/${loggedInUser.userid}/unreadMessages`),{'null':true})
      }
      if (!isReceiverId.exists()){
        set(ref(db,`users/${selectedChatRoom.userid}/unreadMessages`),{'null':true})
      }

      const messageData={
        userid:loggedInUser.userid,
        receiverid:selectedChatRoom.userid,
        name:loggedInUser.username,
        profilePicture:loggedInUser.profilePicture,
        message:gif?gifurl:textFeildValue,
        timestamp:new Date().getTime(),
        type:gif?"gif":"text",
        fcmToken:selectedChatRoom.fcmToken?selectedChatRoom.fcmToken:"",
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
  const markMessagesAsRead = async(senderUserID,recipientUserID) => {
    const recipientRef = ref(db, `users/${recipientUserID}/unreadMessages/${senderUserID}`);

    const recipientSnapshot = await get(recipientRef);

    if (recipientSnapshot.exists()) {
      await set(recipientRef, 0);
    }
  };
  // for updating the unread messages count
  const updateUnreadMessages = async (senderUserID, recipientUserID) => {

    const recipientRef = ref(db, `users/${recipientUserID}/unreadMessages/${senderUserID}`);
    const recipientSnapshot = await get(recipientRef);
    const recipientUnreadCount = recipientSnapshot.exists() ? recipientSnapshot.val(): 0;
    await set(recipientRef, recipientUnreadCount + 1); // Increment the count by 1
  }
  

  // for handling realtime updates (adding listerners to to all friends)
  const handleBackgroundMessages=async()=>{

    const chatRoomListeners=[]

    if (friends.length > 0 && defaultChatSet) {
      // console.log("starting the listener function...")

      const ACTIVE_CHAT_ROOM = [loggedInUser.userid, selectedChatRoom.userid].sort().join("");

      friends.forEach(async(friend) => {
        const chatRoomId = [loggedInUser.userid, friend.userid].sort().join("");
        const chatRoomRef = ref(db, `messages/${chatRoomId}`);

        const lastInteractionTimestamp=(await get(ref(db,`chatRoomLastInteractions/${chatRoomId}/lastInteractionTimestamp`))).val()
        // console.log(lastInteractionTimestamp)
  
        const listener = onChildAdded(chatRoomRef, (snapshot) => {
          const message = snapshot.val();
          if (message) {  
            if (message.roomid === ACTIVE_CHAT_ROOM && message.userid !== loggedInUser.userid) {
              console.log("same room");
              // updateUnreadMessages(message.userid,message.receiverid)
            }
            else if(message.userid !== loggedInUser.userid && message.receiverid!==selectedChatRoom.userid && message.timestamp>lastInteractionTimestamp) {
                console.log(`received new message from ${message.name}`);
                updateUnreadMessages(message.userid,message.receiverid)
                send_push_notification(message.fcmToken,`${message.name} sent a message!`,'New Chat')
            }
          }
        });
        chatRoomListeners.push({ chatRoomId, listener });
      });
      console.log(`added listeners succesfully✅ : Active Listeners -> ${chatRoomListeners.length}`)
      
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
    console.log("fetching friends data...🔃")
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
        console.log("Friends data fetch successfull✅")
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

  // initiates initial data fetch as soon as loggedInUser.userid is loaded
  useEffect(()=>{
    if(loggedInUser.userid && friends.length === 0){
      fetchInitialData()
    }
  },[loggedInUser.userid])


  // if the initial data(friends) is fetched then it starts to set a default chat
  useEffect(()=>{
    if(friends.length>0){
      console.log("Total Friends Count -> ",friends.length)
      updateDefaultData()
    }
  },[friends])

  // this sets a default chat open for the user when the user opens the chat page
  const updateDefaultData=()=>{
    setSelectedChatRoom({userid:friends[0].userid,username:friends[0].username,profilePicture:`${BUCKET_URL}/${friends[0].profilePicture}`,fcmToken:friends[0].fcmToken})
    console.log('default chat has been set',selectedChatRoom)
    setHasInitialDataLoaded(true)
    setDefaultChatSet(true) 
  }

  // listener for unread messages
  const listenToUnreadMessages = async() => {
    console.log('listening for unread messages')
      const unsubscribeFunctions = [];
  
      friends.forEach((friend) => {
        const friendID = friend.userid;
        const unreadMessagesRef = ref(db, `users/${loggedInUser.userid}/unreadMessages/${friendID}`);
  
        const unsubscribe = onValue(unreadMessagesRef, (snapshot) => {
          const unreadCount = snapshot.val();
          setUnreadMessageCounts((prevCounts) => ({
            ...prevCounts,
            [friendID]: unreadCount,
          }));
        });
  
        unsubscribeFunctions.push(unsubscribe);
      });
  
      return () => {
        unsubscribeFunctions.forEach((unsubscribe) => {
        unsubscribe();
        });
      };
  };
  
  // it checks if the initial data has been loaded 
  // defautl chat has been set
  // and then it runs the listener for unread messages
  useEffect(() => {
    if(hasInitialDataLoaded){
      console.log('initial data has been loaded initiating adding listerner on each chat processs...')

      const inititebackgroundcheck=async()=>{
        await handleBackgroundMessages()
        await listenToUnreadMessages()
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

  // handles the chat sorting based on unread messages count
  useEffect(() => {
    console.log('sorting chats based on unread messages count...');
    const sortedFriends = friends.slice().sort((a, b) => {
      const unreadCountA = unreadMessageCounts[a.userid] || 0;
      const unreadCountB = unreadMessageCounts[b.userid] || 0;
      return unreadCountB - unreadCountA;
    });
  
    // Update the state with the sorted array
    setSortedChats(sortedFriends);
  }, [unreadMessageCounts, friends]);


  // handles the outside click and close the gif modal
  const handleOutsideClick = (event) => {
    if (modalContainerRef.current && !modalContainerRef.current.contains(event.target)) {
      setIsGiphyModalOpen(false);
    }
  };

  // responsible for adding click listener at the window
  useEffect(() => {
    // Add a mousedown event listener to the document
    document.addEventListener('mousedown', handleOutsideClick);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <>
    <Navbar/>


    {/* <IconButton> */}
    {
      SM?(
        isDmsOpen?(
        <Badge badgeContent={totalUnreadMessages} color="primary" sx={{"position":"absolute",right:10,top:25,zIndex:9000,color:"white"}}>
          <ArrowForwardIosIcon onClick={()=>{setIsDmsOpen(!isDmsOpen)}}/>
    </Badge>
        ):(
          <Badge badgeContent={totalUnreadMessages} color="primary" sx={{"position":"absolute",right:10,top:25,zIndex:9000,color:"white"}}>
            <ArrowBackIosIcon onClick={()=>{setIsDmsOpen(!isDmsOpen)}}/>
          </Badge>
      )
      ):("")
      
    }
    {/* </IconButton> */}

    {/* parent stack */}
    <Stack direction={"row"} justifyContent={"space-between"}  alignItems="flex-start">
      <Leftbar/>

      {/* main tab - messaging */}
      <Stack flex={4} sx={{height:'calc(100vh - 4.5rem)'}}   p={SM?0.4:1} position={'relative'}>

        {/* chat display */}
        <Stack flex={4} sx={{overflowY:"scroll",bgcolor:bgcolor,color:color}} ref={chatContainerRef}>

          {/* chat bar */}
          <Stack direction={'row'} position={'sticky'} top={0} zIndex={8}  sx={{bgcolor:theme.palette.primary.main,color:"white",transition:".8s"}} p={2} height={'4rfem'} borderRadius={".4rem"} justifyContent={'space-between'}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Avatar src={selectedChatRoom.profilePicture}/>
            <Typography variant='h6' component={Link} sx={{color:isDarkTheme?"white":"white",textDecoration:"none"}} to={`/profile/${selectedChatRoom.username}`}>
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
                    return <ChatMessage mobile={is480} profilePicture={`${BUCKET_URL}/${data.profilePicture}`} key={data.timestamp} message={data.message} type={data.type} own={loggedInUser.userid===data.userid}/>
                  })
                ))
              )
           
          }

        </Stack>
        
        {
          isGiphyModalOpen?(
        <Box sx={{position:"absolute",bottom:50,right:0,zIndex:400}} ref={modalContainerRef}>
                  <ReactGiphySearchbox apiKey={GIPHY_API_KEY} 
                                onSelect={(item)=>handleSendMessage(true,item.images.original_mp4.mp4)} 
                                  masonryConfig={[
                                    { columns: LG?2:3, imageWidth: is380?160:is480?180:200, gutter: 1 },
                                  ]}
                                />
        </Box>
          ):("")
        }


        {/* chat entry */}
        <Stack flex={.4} justifyContent={'center'} alignItems={'center'}>
            <Stack direction={'row'} width={"100%"}>
              {
                selectedChatRoom.userid===''?(""):(
                  <>
                                <TextField fullWidth InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            {/* <IconButton>
            <AttachmentIcon />
            </IconButton> */}
            <IconButton onClick={()=>setIsGiphyModalOpen(!isGiphyModalOpen)}>
              <GifBox/>
            </IconButton>
          </InputAdornment>
        ),
      }}
              onKeyDown={(e)=>{
                
                if (e.key === 'Enter' && textFeildValue.trim()!== '' && textFeildValue!==''){
                  handleSendMessage()
                  }
            }}
              
              placeholder='Write your message...' value={textFeildValue} onChange={(e)=>setTextFeildValue(e.target.value)}></TextField>

              <Button variant='outlined'  disabled={textFeildValue.trim()=== ''} onClick={handleSendMessage}><Send/></Button></>

                )
              }

            </Stack>
        </Stack>
      </Stack>


      {

          <Stack flex={LG?2:1.2} p={1} sx={{height:'calc(100vh - 4.5rem)',overflowY:'scroll',position:SM?"fixed":'',left:isDmsOpen?0:'40rem',bgcolor:bgcolor,transition:".2s",width:"100vw",zIndex:90000}} justifyContent={'flex-start'} alignContent={'flex-start'}>
        {/* <TextField  placeholder='Search..' sx={{mt:2}} variant='outlined' value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}></TextField> */}
        {
          loading?(<CircularProgress sx={{alignSelf:'center',justifySelf:"center",marginTop:'2rem'}}/>):(
            sortedChats.length===0?("no frirends"):(
                sortedChats.map((data)=>{
              return <Conversations key={data.userid} bgColor={bgcolor} color={color} unreadCount={unreadMessageCounts[data.userid]}  fcmToken={data.fcmToken}  setSelectedChatRoom={setSelectedChatRoom} userid={data.userid} username={data.username} profilePicture={`${BUCKET_URL}/${data.profilePicture}`} location={data.location}/>
          })
          ))
        }
        </Stack>
        
      }
      
    </Stack>


    </>
    
  )
}
