import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';



export const SnackAlert=({open,message})=> {

  function SlideTransition(props) {
    return <Slide {...props} direction="up" />;
  }
  
  const [state, setState] = React.useState({
    open: open,
    Transition: Fade,
  });

  const handleClick = (Transition) => () => {
    setState({
      open: true,
      Transition,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
    });
  };

  return (
    <>
      <Snackbar
        open={state.open}
        onClose={handleClose}
        TransitionComponent={SlideTransition}
        message={message}
        key={state.Transition.name}
      />
    </>
  );
}