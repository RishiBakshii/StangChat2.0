import {AppBar,Typography,styled,Stack, Avatar, useMediaQuery} from '@mui/material'
import {alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { useContext } from 'react';
import { loggedInUserContext } from '../context/user/Usercontext';
import { Link } from 'react-router-dom';
import PersistentDrawerLeft from './LeftbarMobile';
import {useTheme} from '@mui/material/styles';
import { BUCKET_URL } from '../envVariables';


const BASE_URL=process.env.REACT_APP_API_BASE_URL;

const Customtoolbar=styled(Toolbar)({
  display:"flex",
  justifyContent:"space-evenly",
  height:"4.5rem"
})
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
    // vertical padding + font size from searchIcon
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
  const theme=useTheme()
  const MD=useMediaQuery(theme.breakpoints.up("lg"))
  const SM=useMediaQuery(theme.breakpoints.down("sm"))
  const loggedInUser=useContext(loggedInUserContext)
  return (
    <>
    {
      MD?(<AppBar position='sticky' sx={{display:{xs:"none",sm:"none",md:"none",lg:"block",xl:"block"}}}>
        <Customtoolbar >

          <Typography variant='h5' component={Link} sx={{"textDecoration":"none","color":"white"}} fontWeight={"700"}>StangChat</Typography>

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
              <Avatar alt={loggedInUser.loggedInUser.username} src={`${BUCKET_URL}/${loggedInUser.loggedInUser.profilePicture}`} />
              <Typography variant='h5'>{`${loggedInUser.loggedInUser.username}`}</Typography>
          </Stack>

        </Customtoolbar>
    </AppBar>):(<PersistentDrawerLeft/>)
    }

    </>
  )
}
