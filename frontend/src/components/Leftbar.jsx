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
import { BugReport } from '@mui/icons-material';
import { Logoutmodal } from './Logoutmodal';
import { BASE_URL } from '../envVariables';


export const Leftbar=()=> {


  const setCookie=async()=>{
    const response=await fetch(`${BASE_URL}/new_cookie`,{
      method:"GET"
    })
    const json=await response.json()

    alert(json.message)
  }

  const loggedInUser=useContext(loggedInUserContext)

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isLogoutModal,setIsLogoutModal]=useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseLogoutModal=()=>{
    setIsLogoutModal(false)
  }

  const handleOpenLogoutModal=()=>{
    setIsLogoutModal(true)
  }

  return (
    <Box p={2} flex={1}>
      <Box position={'fixed'} bgcolor={'background.paper'}>
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to='/'>
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary="Home"/>
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
        </List>
      </nav>
      <Divider />
        <Divider />
      <ListItem disablePadding>
            <ListItemButton onClick={handleOpenModal}>
            <ListItemIcon><PostAddIcon/></ListItemIcon>
              <ListItemText primary="New Post" />
            </ListItemButton>
        </ListItem>
      <Divider />
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <BugReport/>
              </ListItemIcon>
              <ListItemText primary="Report a bug"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><ForumIcon/></ListItemIcon>
              <ListItemText primary="Community" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <ListItem disablePadding>
            <ListItemButton onClick={handleOpenLogoutModal}>
            <ListItemIcon><LogoutIcon/></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
      {/* <ListItem disablePadding>
            <ListItemButton>
              <IconButton></IconButton>
              <Switch defaultChecked />
              <ListItemText primary="darkMode" />
            </ListItemButton>
          </ListItem> */}

          <PostModal isOpen={isModalOpen} onClose={handleCloseModal}/>
          <Logoutmodal open={isLogoutModal} handleClose={handleCloseLogoutModal}/>
    </Box>
    </Box>
    
  );
}