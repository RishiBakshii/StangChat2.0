import React from 'react'

export const Comments = ({username,profilepath,comment,}) => {
  return (
  <Stack key={comment._id.$oid} mt={4} bgcolor={"white"} spacing={1} p={'0 1rem'}>

      <Stack direction={"row"} alignItems={"center"} spacing={1}>
        <Avatar alt={username} src={`${BASE_URL}/${profilepath}`} component={Link} to={`/profile/${username}`}/>
        <Typography sx={{"textDecoration":"none",color:"black"}} component={Link} to={`/profile/${comment.username}`}>{comment.username}</Typography>
      </Stack>

      <Stack bgcolor={""} direction={"row"} alignItems={"center"} justifyContent={"space-between"}>

          <Typography variant="body2" color="text.primary">{comment}</Typography>

          <Stack direction={"row"} alignItems={"center"}>
              <Checkbox checked={commentLikes[comment._id.$oid]} onClick={() => handleCommentLike(comment._id.$oid)} icon={<FavoriteBorder fontSize="small"/>} checkedIcon={<Favorite fontSize="small" sx={{ color: "red" }} />}/>
              <Typography variant="body2">{commentLikes[comment._id.$oid] ? comment.likeCount + 1 : comment.likeCount}</Typography>        
          </Stack>

      </Stack>

</Stack>
  )
}
