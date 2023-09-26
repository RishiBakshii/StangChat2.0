import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Badge, Stack } from '@mui/material';

export default function Conversations({username,profilePicture,location,userid,setSelectedChatRoom,bgColor,color,unreadCount,fcmToken}) {
  return (
    <>
    
    <List sx={{ width: '100%',bgcolor: unreadCount>0?'':bgColor,color:color,cursor:"pointer"}} onClick={()=>setSelectedChatRoom({'userid':userid,'username':username,'profilePicture':profilePicture,'fcmToken':fcmToken})}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
        <Badge badgeContent={unreadCount} color="info" anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Avatar alt={`${username} profile Avatar`} src={profilePicture} />
        </Badge>
        </ListItemAvatar>
        <ListItemText
          // primary="Brunch this weekend?"
          secondary={
            <Stack>
              <Typography sx={{ display: 'inline' ,bgcolor:bgColor,color:color}}component="span" variant="body2" color="text.primary">
                {`${username} `}
              </Typography>
              {location}
            </Stack>
          }
        />
      </ListItem>
    <Divider/>
    </List>
    
    
    </>
  );
}