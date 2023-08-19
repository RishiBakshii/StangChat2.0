import React, { useContext } from 'react'
import { Postcard } from './Postcard'
import { Stack } from '@mui/material'
import { BASE_URL, feedData } from '../screens/Home'


export const Feed = () => {

  const feeds=useContext(feedData)
  return (
    <>
    <Stack flex={4} p={2}>


      {feeds.map((feed) => (
        <Postcard
          key={feed._id.$oid}
          imageUrl={`${BASE_URL}/${feed.postPath}`}
          username={feed.username}
          likes={0}
          caption={feed.caption}
        />
      ))}
      <Postcard imageUrl={'https://images.pexels.com/photos/3783513/pexels-photo-3783513.jpeg?auto=compress&cs=tinysrgb&w=1600'}/>
      <Postcard imageUrl={"https://images.pexels.com/photos/12169176/pexels-photo-12169176.jpeg?auto=compress&cs=tinysrgb&w=1600"}/>
      <Postcard imageUrl={"https://images.pexels.com/photos/7148973/pexels-photo-7148973.jpeg?auto=compress&cs=tinysrgb&w=1600"}/> 


    </Stack>
    </>
  )
}
