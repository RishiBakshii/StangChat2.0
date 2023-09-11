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

export const LeftBarItems = () => {
    const loggedInUser=useContext(loggedInUserContext)
    const theme=useTheme()

    const MD=useMediaQuery(theme.breakpoints.up("lg"))
  
    const [open, setOpen] = useState(false);
    const [logoutModalOpen,setLogoutModalOpen]=useState(false)
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [bugReportOpen,setBugReportOpen]=useState(false)
    
  return (
    <>
    <List>
    <ListItem disablePadding>
      <ListItemButton component={Link} to='/'>
        <ListItemIcon><HomeIcon/></ListItemIcon>
        <ListItemText primary="Home"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={`/search`}>
        <ListItemIcon><Search/></ListItemIcon>
        <ListItemText primary="Search"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={`/profile/${loggedInUser.loggedInUser.username}`}>
        <ListItemIcon><PersonIcon/></ListItemIcon>
        <ListItemText primary="Profile"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to='/friends'>
      <ListItemIcon><Diversity3Icon/></ListItemIcon>
        <ListItemText primary="Friends" />
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to='/settings'>
      <ListItemIcon><SettingsIcon/></ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </ListItem>
<Divider />
<Divider />
<ListItem disablePadding>
      <ListItemButton onClick={()=>{setPostModalOpen(true)}}>
      <ListItemIcon><PostAddIcon/></ListItemIcon>
        <ListItemText primary="New Post" />
      </ListItemButton>
  </ListItem>
<ListItem disablePadding>
      <ListItemButton component={Link} to={"/explore"}>
      <ListItemIcon><Explore/></ListItemIcon>
        <ListItemText primary="Explore" />
      </ListItemButton>
  </ListItem>
<ListItem disablePadding>
      <ListItemButton component={Link} to={"/leaderboard"}>
      <ListItemIcon><EmojiEventsIcon/></ListItemIcon>
        <ListItemText primary="LeaderBoard" />
      </ListItemButton>
  </ListItem>
<Divider />
    <ListItem disablePadding>
      <ListItemButton onClick={()=>setBugReportOpen(true)}>
        <ListItemIcon>
          <BugReport/>
        </ListItemIcon>
        <ListItemText primary="Report a bug"/>
      </ListItemButton>
    </ListItem>
    <ListItem disablePadding>
      <ListItemButton component={Link} to={"/globalchat"}>
        <ListItemIcon><ForumIcon/></ListItemIcon>
        <ListItemText primary="Global Chat✨"/>
      </ListItemButton>
    </ListItem>
<Divider />
<ListItem disablePadding>
      <ListItemButton onClick={()=>{setLogoutModalOpen(true)}}>
      <ListItemIcon><LogoutIcon/></ListItemIcon>
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
