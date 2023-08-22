import {Box,List,ListItem,ListItemButton ,ListItemIcon,ListItemText,Divider} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ForumIcon from '@mui/icons-material/Forum';
import ErrorIcon from '@mui/icons-material/Error';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import HomeIcon from '@mui/icons-material/Home';
import { Link ,useNavigate} from 'react-router-dom';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Modal from '@mui/material/Modal';
import { Button, Stack, Typography } from '@mui/material';
import {useState } from 'react';
import {PostModal} from '../components/PostModal'
import { useContext } from 'react';
import { loggedInUserContext } from '../context/user/Usercontext';
import { BugReport } from '@mui/icons-material';


export const Leftbar=()=> {

  const loggedInUser=useContext(loggedInUserContext)

  const modalstyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    // border: '2px solid #000',
    boxShadow: 24,
    p:4
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const navigate=useNavigate()

  const logoutUser=()=>{
    localStorage.removeItem('authToken')
    navigate('/login')
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
      {/* <ListItem disablePadding>
            <ListItemButton component={Link} to='/aboutfaculty'>
            <ListItemIcon><FaceRetouchingNaturalIcon/></ListItemIcon>
              <ListItemText primary="Know Your Faculty" />
            </ListItemButton>
        </ListItem> */}
      {/* <ListItem disablePadding>
            <ListItemButton component={Link} to="/upcomingclasses">
            <ListItemIcon><LocalLibraryIcon/></ListItemIcon>
              <ListItemText primary="See Upcoming Classes" />
            </ListItemButton>
        </ListItem> */}
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
            <ListItemButton onClick={()=>setOpen(true)}>
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

          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Stack sx={modalstyles} justifyContent={'flex-start'} alignItems={"flex-start"} bgcolor={'white'} spacing={3}>

            <Typography id="modal-modal-title" variant="h6" component="h2">Logout</Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to logout?🤫
            </Typography>
            <Stack direction={'row'} spacing={2}>
              <Button onClick={logoutUser} variant='outlined'>Yes</Button>
              <Button onClick={()=>setOpen(false)} variant='contained'>No</Button>
            </Stack>
          
        </Stack>

          </Modal>
          <PostModal isOpen={isModalOpen} onClose={handleCloseModal}/>
    </Box>
    </Box>
    
  );
}