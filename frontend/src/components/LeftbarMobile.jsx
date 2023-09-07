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
import PersonIcon from '@mui/icons-material/Person';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SettingsIcon from '@mui/icons-material/Settings';
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
import {Explore} from '../screens/Explore'
import { LeftBarItems } from './LeftBarItems';
// import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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
  const [isLogoutModal,setIsLogoutModal]=useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseLogoutModal=()=>{
    setIsLogoutModal(false)
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


      <Divider />
      <Divider />
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

          <LeftBarItems/>

        <Divider />
        <Divider />

        
      </Drawer>
      <PostModal isOpen={isModalOpen} onClose={handleCloseModal}/>
      <Logoutmodal open={isLogoutModal} handleClose={handleCloseLogoutModal}/>
    </Box>
  );
}
