import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function Conversations({username,profilePicture,location,userid,setSelectedChatRoom,bgColor,color}) {
  return (
    <>
    
    <List sx={{ width: '100%',bgcolor: bgColor,color:color,cursor:"pointer"}} onClick={()=>setSelectedChatRoom({'userid':userid,'username':username,'profilePicture':profilePicture})}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={profilePicture} />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <>
              <Typography sx={{ display: 'inline' ,bgcolor:bgColor,color:color}}component="span" variant="body2" color="text.primary">
                {`${username} `}
              </Typography>
              {location}
            </>
          }
        />
      </ListItem>
    <Divider/>
    </List>
    
    
    </>
  );
}