import Modal from '@mui/material/Modal';
import { GIPHY_API_KEY } from '../envVariables';
import ReactGiphySearchbox from 'react-giphy-searchbox'
import theme from '../theme';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY:"scroll",
    [theme.breakpoints.down("480")]:{
      width:"18rem"
    }
};

export const GifModal=({open,handleClose})=> {

  return (
      <Modal style={style} open={open} onClose={handleClose} aria-labelledby="giphy-gif-selector" aria-describedby="here a user can select a gif to send">

            <ReactGiphySearchbox apiKey={GIPHY_API_KEY} 
                            onSelect={(item)=>console.log(item)} 
                            masonaryConfig={[{columns:2,imageWidth:11,gutter:5},
                            {mq:'700px',columns:3,imageWidth:120,gutter:5}]}
        />

        
      </Modal>
  );
}