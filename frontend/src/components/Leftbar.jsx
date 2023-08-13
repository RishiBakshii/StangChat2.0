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

export const Leftbar=()=> {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon><PersonIcon/></ListItemIcon>
              <ListItemText primary="Profile"/>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
            <ListItemIcon><Diversity3Icon/></ListItemIcon>
              <ListItemText primary="Friends" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
            <ListItemIcon><SettingsIcon/></ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
            <ListItemIcon><LogoutIcon/></ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      <Divider />
      <ListItem disablePadding>
            <ListItemButton component="a" href="/about">
            <ListItemIcon><FaceRetouchingNaturalIcon/></ListItemIcon>
              <ListItemText primary="Know Your Faculty" />
            </ListItemButton>
        </ListItem>
      <ListItem disablePadding>
            <ListItemButton component="a" href="#simple-list">
            <ListItemIcon><LocalLibraryIcon/></ListItemIcon>
              <ListItemText primary="See Upcoming Classes" />
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
    </Box>
  );
}