import {Box} from '@mui/material';
import {useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { LeftBarItems } from './LeftBarItems';


export const Leftbar=()=> {
  const theme=useTheme()

  const MD=useMediaQuery(theme.breakpoints.up("lg"))

  return (
    <>
    {
      MD?(
         <Box p={2} flex={1} sx={{display:{xs:"none",sm:"none",md:"none",lg:"block",xl:"block"}}}>
      <Box position={'fixed'} bgcolor={'background.paper'}>
          <LeftBarItems/>
      </Box>
        </Box> 
      ):('')
    }


   
    </>
    
  );
}