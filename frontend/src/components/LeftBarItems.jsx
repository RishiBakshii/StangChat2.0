import {Box,List,ListItem,ListItemButton ,ListItemIcon,ListItemText,Divider} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ForumIcon from '@mui/icons-material/Forum';
import HomeIcon from '@mui/icons-material/Home';
import { Link} from 'react-router-dom';
import PostAddIcon from '@mui/icons-material/PostAdd';
import {useState } from 'react';
import {PostModal} from '../components/PostModal'
import { useContext } from 'react';
import { loggedInUserContext } from '../context/user/Usercontext';
import { BugReport, Explore, Search } from '@mui/icons-material';
import { Logoutmodal } from './Logoutmodal';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { ReportBugModal } from './ReportBugModal';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';

export const LeftBarItems = () => {
    const loggedInUser=useContext(loggedInUserContext)
    const theme=useTheme()
    const [logoutModalOpen,setLogoutModalOpen]=useState(false)
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [bugReportOpen,setBugReportOpen]=useState(false)

    const {isDarkTheme}=useContext(ThemeContext)
    const color=isDarkTheme?theme.palette.common.white:''
    
  return (
    <>
    <List>
    <ListItem disablePadding>
      <ListItemButton component={Link} to='/'>
        <ListItemIcon><HomeIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Home"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={`/search`}>
        <ListItemIcon><Search sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Search"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={`/profile/${loggedInUser.loggedInUser.username}`}>
        <ListItemIcon><PersonIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Profile"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to='/friends'>
      <ListItemIcon><Diversity3Icon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Friends" />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to='/settings'>
      <ListItemIcon><SettingsIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </ListItem>
<Divider sx={{bgcolor:color,opacity:`${isDarkTheme?'.1':''}`}}/>
<ListItem disablePadding>
      <ListItemButton onClick={()=>{setPostModalOpen(true)}}>
      <ListItemIcon><PostAddIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="New Post" />
      </ListItemButton>
  </ListItem>
<ListItem disablePadding>
      <ListItemButton component={Link}  to={"/explore"}>
      <ListItemIcon><Explore sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Explore" />
      </ListItemButton>
  </ListItem>
<ListItem disablePadding>
      <ListItemButton component={Link} to={"/leaderboard"}>
      <ListItemIcon><EmojiEventsIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="LeaderBoard" />
      </ListItemButton>
  </ListItem>
<Divider sx={{bgcolor:color,opacity:`${isDarkTheme?'.1':''}`}}/>
    <ListItem disablePadding>
      <ListItemButton onClick={()=>setBugReportOpen(true)}>
        <ListItemIcon>
          <BugReport sx={{color:color}}/>
        </ListItemIcon>
        <ListItemText primary="Report a bug"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={"/globalchat"}>
        <ListItemIcon><ForumIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Global Chat✨"/>
      </ListItemButton>
    </ListItem>
    {/* <ListItem disablePadding>
      <ListItemButton component={Link} to={"/chats"}>
        <ListItemIcon><ForumIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Chats"/>
      </ListItemButton>
    </ListItem> */}
<Divider  sx={{bgcolor:color,opacity:`${isDarkTheme?'.1':''}`}}/>
<ListItem disablePadding>
      <ListItemButton onClick={()=>{setLogoutModalOpen(true)}}>
      <ListItemIcon><LogoutIcon sx={{color:color}}/></ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </ListItem>
  </List>

<PostModal isOpen={postModalOpen} onClose={()=>setPostModalOpen(false)}/>
<Logoutmodal open={logoutModalOpen} handleClose={()=>setLogoutModalOpen(false)}/>
<ReportBugModal open={bugReportOpen} handleClose={()=>{setBugReportOpen(false)}}/>

</>
  )
}
