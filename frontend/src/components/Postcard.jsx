import React from 'react'
import { Avatar, Box, Card, CardActions, CardContent, CardHeader, CardMedia, IconButton ,Typography,Checkbox} from "@mui/material";
import { ExpandMore ,MoreVert,Share,Favorite, CheckBox, FavoriteBorder} from "@mui/icons-material";
export const Postcard = ({imageUrl}) => {
  return (
    <Card sx={{margin:5}}>
    <CardHeader
      avatar={
        <Avatar sx={{ bgcolor: 'red' }} aria-label="recipe">
          R
        </Avatar>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVert />
        </IconButton>
      }
      title="Shrimp and Chorizo Paella"
      subheader="September 14, 2016"
    />

    <CardMedia
      component="img"
      height="20%"
      image={imageUrl}
      alt="Paella dish"
    />

    <CardContent>
      <Typography variant="body2" color="text.secondary">
        This impressive paella is a perfect party dish and a fun meal to
        cook together with your guests. Add 1 cup of frozen peas along with
        the mussels, if you like.
      </Typography>
    </CardContent>

    <CardActions disableSpacing>
      <IconButton aria-label="add to favorites">
        <Checkbox icon={<FavoriteBorder/>} checkedIcon={<Favorite/>}></Checkbox>
      </IconButton>
      <IconButton aria-label="share">
        <Share />
      </IconButton>
    </CardActions>
  </Card>
  )
}
