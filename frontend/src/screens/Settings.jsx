import React, { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Leftbar } from '../components/Leftbar'
import { Button, List, ListItem, ListItemIcon, ListItemText, ListSubheader,Stack, Switch, Typography} from '@mui/material'
import { ThemeContext } from '../context/Theme/ThemeContext'
import theme from '../theme'
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { BASE_URL,SERVER_DOWN_MESSAGE } from '../envVariables'
import { useNavigate } from 'react-router-dom'
import { loggedInUserContext } from '../context/user/Usercontext'
import { handleApiResponse } from '../utils/common'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import { messaging} from '../firebase'
import { getToken } from "firebase/messaging";
import { NotificationHelperModal } from '../components/NotificationHelperModal'


export const Settings = () => {
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  const {isDarkTheme,changeTheme}=useContext(ThemeContext)
  const navigate=useNavigate()
  const loggedInUser=useContext(loggedInUserContext)
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const [isNotificationHelperOpen,setIsNotificationHelperOpen]=useState(false)
  const [hasAllowedPermissions, setHasAllowedPermissions] = useState(loggedInUser.loggedInUser.fcmToken===''?false:true);



  useEffect(()=>{
    setHasAllowedPermissions(loggedInUser.loggedInUser.fcmToken===''?false:true)
  },[loggedInUser.loggedInUser])

  document.body.style.backgroundColor = isDarkTheme ? theme.palette.primary.customBlack : theme.palette.background.paper;
  document.body.style.color = isDarkTheme ? theme.palette.background.paper : theme.palette.common.black;
  
  const color=isDarkTheme?theme.palette.common.white:""
  const bgcolor=isDarkTheme?theme.palette.primary.customBlack:theme.palette.background.paper

  const showNotificationHelper=()=>{
    setIsNotificationHelperOpen(true)
  }
  

  const GenerateAndsendFcmTokenToBackend=async()=>{
    try {
      const token=await getToken(messaging,{vapidKey:'BFRVtIOBTU4TME4r7O6OoXfwpaPeKWgL1lwO1xlv-IRgcou-o1giz_an4RZoy393rhr2wwl-Or7Fh8e7xFCfoOc'})

      const response=await fetch(`${BASE_URL}/storefcmtoken`, {
      method: 'POST',
      credentials:"include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "userid":loggedInUser.loggedInUser.userid,
        "fcmToken":token
      }),
      })
      const result=await handleApiResponse(response)
      console.log('result',result)

      if(result.success){
        loggedInUser.setLoggedInUser({...loggedInUser.loggedInUser,fcmToken:token})
        setHasAllowedPermissions(true)
        console.log(result)
        setGlobalAlertOpen({state:true,message:'Great! Now you will receive realtime notifications from stangchat🚀'})
      }
      else if(result.logout){
        navigate("/login")
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
        loggedInUser.setLoggedInUser({...loggedInUser.loggedInUser,fcmToken:''})
      }
    } catch (error) {
      setGlobalAlertOpen({state:true,message:'Please reset browser permissions or watch helper video by clicking on yes'})
      console.log(error)
    }

  }

  const deleteFcmToken=async()=>{
    try {
      const response=await fetch(`${BASE_URL}/deletefcmtoken`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        credentials:"include",
        body:JSON.stringify({
          'userid':loggedInUser.loggedInUser.userid
        })
      })

      const result=await handleApiResponse(response)

      if(result.success){
        loggedInUser.setLoggedInUser({...loggedInUser.loggedInUser,fcmToken:''})
        setGlobalAlertOpen({state:true,message:result.data.message})
        setHasAllowedPermissions(false)
      }
      else if(result.logout){
        navigate("/login")
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }

    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
  }

  return (
    <>
    <Navbar/>
    <Stack direction={"row"} justifyContent={"space-between"} alignItems="flex-start">
        <Leftbar/>

        <Stack flex={4} mt={4} justifyContent={'center'} alignItems={'flex-start'} bgcolor={bgcolor} color={color}>

          <List sx={{ width: '100%', maxWidth: 360, bgcolor: bgcolor ,color:color}} subheader={<ListSubheader sx={{bgcolor:bgcolor,color:color}}>Settings</ListSubheader>}>
            
            {/* notificaions */}
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon sx={{color:color}}/>
              </ListItemIcon>

              <ListItemText id="switch-list-label-wifi" primary="Notifications"/>
              <Switch
              edge="end"
              checked={hasAllowedPermissions}
              onChange={(e)=>{
                if(e.target.checked){
                  GenerateAndsendFcmTokenToBackend()
                }
                else{
                  deleteFcmToken()
                }
              }
                }
              inputProps={{
              'aria-labelledby': 'notification-permissions',
            }}
              />
            </ListItem>


            
            {/* dark mode | light mode */}
            <ListItem>
              <ListItemIcon>
                {
                  isDarkTheme?<DarkModeIcon sx={{color:color}}/>:<LightModeIcon sx={{color:color}}/>
                }
              </ListItemIcon>

              <ListItemText id="switch-list-label-bluetooth" primary={isDarkTheme?"Dark":"Light"} />
              <Switch edge="end" {...label} checked={isDarkTheme} onChange={changeTheme}/>
            </ListItem>

            <ListItem>
              {
                !hasAllowedPermissions?
                <>
                <Typography>Facing issues updating notifications?</Typography>
                <Button onClick={showNotificationHelper}>Yes</Button>
                </>
                :''
              }
            </ListItem>

          <Button onClick={()=>{}}></Button>

      </List>
      <NotificationHelperModal open={isNotificationHelperOpen} handleClose={()=>setIsNotificationHelperOpen(false)}/>
        </Stack>
      </Stack>


    </>
  )
}
