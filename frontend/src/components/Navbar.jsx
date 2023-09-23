import {AppBar,Typography,styled,Stack, Avatar, useMediaQuery, MenuItem, Menu, Button} from '@mui/material'
import {alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useContext, useState } from 'react';
import { loggedInUserContext } from '../context/user/Usercontext';
import { Link } from 'react-router-dom';
import PersistentDrawerLeft from './LeftbarMobile';
import { BUCKET_URL } from '../envVariables';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const Navbar = () => {

  const {isDarkTheme}=useContext(ThemeContext)
  const color=isDarkTheme?theme.palette.background.paper:theme.palette.common.white

  const Customtoolbar=styled(Toolbar)({
    display:"flex",
    justifyContent:"space-evenly",
    height:"4.5rem",
    backgroundColor:isDarkTheme?theme.palette.primary.customBlack:theme.palette.primary.main,
    color:color
  })

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };


  const MD=useMediaQuery(theme.breakpoints.up("lg"))
  const loggedInUser=useContext(loggedInUserContext)
  return (
    <>
    {
      MD?(<AppBar  position='sticky' sx={{display:{xs:"none",sm:"none",md:"none",lg:"block",xl:"block"}}}>
        <Customtoolbar >

          <Typography variant='h5' component={Link} sx={{"textDecoration":"none",color:color}} fontWeight={"700"}>StangChat</Typography>

          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search Users"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Stack direction={'row'} spacing={2} alignItems={'center'}>
              <Avatar onClick={handleOpenUserMenu} alt={loggedInUser.loggedInUser.username} src={`${BUCKET_URL}/${loggedInUser.loggedInUser.profilePicture}`} />
              
              <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>

        </Customtoolbar>
    </AppBar>):(<PersistentDrawerLeft/>)
    }

    </>
  )
}
