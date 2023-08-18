import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonIcon from '@mui/icons-material/Person';
import DraftsIcon from '@mui/icons-material/Drafts';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';
import ForumIcon from '@mui/icons-material/Forum';
import ErrorIcon from '@mui/icons-material/Error';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import HomeIcon from '@mui/icons-material/Home';
import { Link ,useNavigate} from 'react-router-dom';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Modal from '@mui/material/Modal';
import { Button, Stack, Typography } from '@mui/material';


export const Leftbar=({username})=> {
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
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const BASE_URL=process.env.REACT_APP_API_BASE_URL;

  const navigate=useNavigate()

  const logoutUser=()=>{
    localStorage.removeItem('authToken')
    navigate('/login')
  }
  return (
    
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to='/'>
              <ListItemIcon><HomeIcon/></ListItemIcon>
              <ListItemText primary="Home"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component={Link} to={`/profile/${username}`}>
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
      <ListItem disablePadding>
            <ListItemButton component={Link} to='/aboutfaculty'>
            <ListItemIcon><FaceRetouchingNaturalIcon/></ListItemIcon>
              <ListItemText primary="Know Your Faculty" />
            </ListItemButton>
        </ListItem>
      <ListItem disablePadding>
            <ListItemButton component={Link} to="/upcomingclasses">
            <ListItemIcon><LocalLibraryIcon/></ListItemIcon>
              <ListItemText primary="See Upcoming Classes" />
            </ListItemButton>
        </ListItem>
        <Divider />
      <ListItem disablePadding>
            <ListItemButton component={Link} to="/">
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
                <ErrorIcon />
              </ListItemIcon>
              <ListItemText primary="Raise an Issue"/>
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

          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Stack sx={modalstyles} justifyContent={'flex-start'} alignItems={"flex-start"} bgcolor={'white'} spacing={3}>

            <Typography id="modal-modal-title" variant="h6" component="h2">Logout</Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to logout?
            </Typography>
            <Stack direction={'row'} spacing={2}>
              <Button onClick={logoutUser} variant='outlined'>Yes</Button>
              <Button onClick={()=>setOpen(false)} variant='contained'>No</Button>
            </Stack>
          
        </Stack>
          </Modal>
    </Box>
  );
}