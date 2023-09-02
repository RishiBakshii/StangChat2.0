import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Leftbar } from './Leftbar';
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
import { ArrowBackTwoTone, BugReport, Search } from '@mui/icons-material';
import { Logoutmodal } from './Logoutmodal';
import { BASE_URL } from '../envVariables';
import { Avatar, Stack, useMediaQuery } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { rightBarContext } from '../context/rigthbar/RightbarContext';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
  const {rightBarOpen,setRightBarOpen}=useContext(rightBarContext)
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const SM=useMediaQuery(theme.breakpoints.down("sm"))
  const is480=useMediaQuery(theme.breakpoints.down("480"))

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  // const [open, setOpen] = useState(false);
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

  const loggedInUser=useContext(loggedInUserContext)

  return (
    <Box sx={{display:{xs:"block",sm:"block",md:"block",lg:"none",xl:"none"}}}>
      <CssBaseline />
      <AppBar position='sticky' open={open}>

        <Toolbar sx={{ display:"flex", justifyContent:"space-around",height:"4.5rem"}}>

          <Box position={'absolute'} left={'2rem'}>
            <IconButton color="inherit" aria-label="open drawer" onClick={handleDrawerOpen} edge="start" sx={{ mr: 2, ...(open && { display: 'none' }) }}>
              <MenuIcon  fontSize='large'/>
            </IconButton>
          </Box>

          <Typography variant='h5' component={Link} sx={{"textDecoration":"none","color":"white"}} fontWeight={"700"} >
            {is480?(""):"StangChat"}
          </Typography>

          <Stack direction={'row'} spacing={2} alignItems={'center'} justifySelf={'flex-end'}>
              <Avatar alt={loggedInUser.loggedInUser.username} src={`${BASE_URL}/${loggedInUser.loggedInUser.profilePicture}`} />
              <Typography variant='h5'>{`${loggedInUser.loggedInUser.username}`}</Typography>
          </Stack>

          {
            SM?(
               <IconButton sx={{"position":"absolute",'right':"1rem"}} onClick={()=>setRightBarOpen(!rightBarOpen)}>
                {rightBarOpen?(<ArrowForwardIosIcon  sx={{"color":"white"}}/>):(<ArrowBackIosIcon sx={{"color":"white"}}/>)}
          </IconButton>
          
            ):("")
          }
         

        </Toolbar>
      </AppBar>

      <Drawer sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', },}} variant="persistent"anchor="left" open={open}>
  
        <DrawerHeader>
          {
            is480?(<Typography textAlign={'left'} p={2} color={"primary"} width={"100%"} variant='h4' fontWeight={900}>StangChat</Typography>):("")
          }

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Divider />

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
          <ListItem disablePadding>
            <ListItemButton onClick={handleOpenModal}>
            <ListItemIcon><PostAddIcon/></ListItemIcon>
              <ListItemText primary="New Post" />
            </ListItemButton>
        </ListItem>
      <Divider />
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
      <Divider />
      <ListItem disablePadding>
            <ListItemButton onClick={handleOpenLogoutModal}>
            <ListItemIcon><LogoutIcon/></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
      </Drawer>
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal}/>
      <Logoutmodal open={isLogoutModal} handleClose={handleCloseLogoutModal}/>
    </Box>
  );
}
