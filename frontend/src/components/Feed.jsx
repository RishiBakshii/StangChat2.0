import React from 'react'
import { Postcard } from './Postcard'
import { Stack } from '@mui/material'


export const Feed = () => {
  return (
    <>
    <Stack flex={4} p={2}>
      <Postcard imageUrl={'https://images.pexels.com/photos/3783513/pexels-photo-3783513.jpeg?auto=compress&cs=tinysrgb&w=1600'}/>
      <Postcard imageUrl={"https://images.pexels.com/photos/12169176/pexels-photo-12169176.jpeg?auto=compress&cs=tinysrgb&w=1600"}/>
      <Postcard imageUrl={"https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"}/>
    </Stack>
    </>
  )
}
