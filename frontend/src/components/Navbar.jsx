
import {AppBar,Typography,styled,Stack, Avatar} from '@mui/material'
import {alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';

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

export const Navbar = ({username,profileURL}) => {

  return (
    <>
    <AppBar position='sticky'>
        <Customtoolbar >

          <Typography variant='h5' fontWeight={"700"}>CampusLink</Typography>

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
              <Avatar alt={username} src={profileURL} />
              <Typography variant='h6'>{`Welcome ${username}`}</Typography>
              <Typography variant='p'>Home</Typography>
              <Typography variant='p'>Notifications</Typography>
          </Stack>

        </Customtoolbar>
    </AppBar>
    </>
  )
}
