import React, { useState } from 'react'
import { GlobalAlertContext } from './GlobalAlertContext'
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';

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
