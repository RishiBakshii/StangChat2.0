import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { useState ,useEffect} from 'react';

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

function TransitionDown(props) {
  return <Slide {...props} direction="down" />;
}

export const Snackalert = ({ show, message }) => {
    const [open, setOpen] = useState(show); // Initialize open state with the value of the show prop
    const [transition, setTransition] = useState(undefined);
  
    const handleClick = (Transition) => () => {
      setTransition(() => Transition);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    useEffect(() => {
      setOpen(show);
    }, [show]);
  
    return (
      <Snackbar
        open={open}
        onClose={handleClose}
        TransitionComponent={transition}
        message={message}
        key={transition ? transition.name : ''}
      />
    );
  };
  
