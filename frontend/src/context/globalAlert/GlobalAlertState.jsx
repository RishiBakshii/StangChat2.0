import React, { useState } from 'react'
import { GlobalAlertContext } from './GlobalAlertContext'
import { SnackAlert } from '../../components/SnackAlert'
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';

export const GlobalAlertState = ({children}) => {

    const [globalAlertOpen,setGlobalAlertOpen]=useState({
        state:false,
        message:''
    })

    function SlideTransition(props) {
      return <Slide {...props} direction="up" />;
    }
    

  return (
    <GlobalAlertContext.Provider value={{setGlobalAlertOpen}}>
        {children}
        <Snackbar
        open={globalAlertOpen.state}
        onClose={()=>setGlobalAlertOpen({state:false,message:''})}
        TransitionComponent={SlideTransition}
        message={globalAlertOpen.message}
      />
    </GlobalAlertContext.Provider>
  )
}
