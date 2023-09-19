import {Box} from '@mui/material';
import {useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LeftBarItems } from './LeftBarItems';
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';


export const Leftbar=()=> {
  const theme=useTheme()
  const {isDarkTheme}=useContext(ThemeContext)

  const MD=useMediaQuery(theme.breakpoints.up("lg"))

  return (
    <>
    {
      MD?(
         <Box p={2} color={`${isDarkTheme?theme.palette.common.white:theme.palette.common.black}`} bgcolor={`${isDarkTheme?theme.palette.primary.customBlack:theme.palette.background.paper}`}  flex={1} sx={{display:{xs:"none",sm:"none",md:"none",lg:"block",xl:"block"}}}>
      <Box position={'fixed'} bgcolor={`${isDarkTheme?theme.palette.primary.customBlack:theme.palette.secondary.light}`}>
          <LeftBarItems/>
      </Box>
        </Box> 
      ):('')
    }


   
    </>
    
  );
}