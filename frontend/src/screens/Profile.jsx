import React, { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import {Stack,Box, Avatar, Typography, Button, Grid} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Rightbar } from '../components/Rightbar'
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useParams } from 'react-router-dom'
import { BASE_URL} from './Home'
import { fetchUserProfile } from '../api/user'
import { Postcard } from '../components/Postcard'
import PhotoIcon from '@mui/icons-material/Photo';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { loggedInUserContext } from '../context/user/Usercontext'


export const Profile = () => {

  const loggedInUser=useContext(loggedInUserContext)
  const {username}=useParams()
  const [profile,setProfile]=useState({})
  const [post,setPost]=useState([])

  const [followerCount,setFollowerCount]=useState()
  const [followingCount,setFollowingCount]=useState()
  const [isFollowing,setIsFollowing]=useState()

  
  
  const fetchProfileData=async()=>{
    const userprofile=await fetchUserProfile(username,loggedInUser.loggedInUser.userid)
    console.log(userprofile.profileData)
    setProfile(userprofile.profileData)
    setPost(userprofile.postData)
    setFollowerCount(userprofile.profileData.followerCount)
    setFollowingCount(userprofile.profileData.followingCount)
    setIsFollowing(userprofile.profileData.isFollowing)
  }
  
  const handleFollowAndUnFollow=async()=>{
    try {
      const response=await fetch(`${BASE_URL}/followunfollow`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          userid:loggedInUser.loggedInUser.userid,
          target_user_id:profile._id.$oid
        })
      })

      const json=await response.json()

      if(response.ok){
        console.log(json)
        setFollowerCount(json.updatedFollowerCount)
        setFollowingCount(json.updatedFollowingCount)
        setIsFollowing(json.isFollowing)
      }
      if(response.status==500){
        alert("internal server error")
        console.log(json.message)
      }
      if(response.status==400){
        alert(json.message)
      }
    } catch (error) {
      alert(error)
    }
  }



  useEffect(()=>{
    fetchProfileData()
  },[])
  return (
  <>
      <Navbar/>
      <Leftbar/>
        
          
                      <Stack flex={"1"} bgcolor={''} spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>
                
                {/* profile parent */}
                <Stack padding={4} bgcolor={'white'} borderRadius={'.6rem'} width={'60%'} justifyContent={'flex-start'} alignItems={'flex-start'}>

                      {/* avatar */}
                      <Stack>
                          <Avatar sx={{width:200,height:200}} alt={`profile picture of ${profile.username}`} src={`${BASE_URL}/${profile.profilePicture}`} />
                      </Stack>
                  {/* username*/}
                  <Stack direction={'row'} alignItems={'center'} spacing={2} mt={5}>
                      <Typography variant='h4' fontWeight={300}>{profile.username}</Typography>
                      <Typography variant='h5' fontWeight={300}>He/Him</Typography>


                      {loggedInUser.loggedInUser.userid===profile?._id?.$oid?(
                        <Button size='large' variant='contained'>Edit Profile</Button>
                      ):(

                      <Button onClick={handleFollowAndUnFollow} size='large' variant='contained'>{isFollowing?("Unfollow"):("Follow")}</Button>
                      )}
                  </Stack>
                  
                  {/* bio  adn location*/}
                  <Stack mt={2} spacing={1}>
                      <Typography variant='body1'>{profile.bio}</Typography>
                      <Stack direction={'row'} justifyContent={'flex-start'} alignItems={"center"} p={0}>
                        <Typography variant='body1'>{profile.location}</Typography>
                        <LocationOnIcon sx={{color:'lightblue'}}/>
                      </Stack>

                  </Stack>

                  {/* followers following post details */}
                  <Stack mt={4} direction={'row'} justifyContent={'center'} alignItems={"center"} spacing={3}>
                            <Typography variant='h6' fontWeight={300} >{followerCount} Followers</Typography>
                            <Typography variant='h6' fontWeight={300} >{followingCount} Following</Typography>
                            <Typography variant='h6' fontWeight={300} >{profile.postCount} Post</Typography>
                  </Stack>
                  {
                    post.length==0?(

                      <Stack mt={2} spacing={1}>
                        <Typography variant='h6' fontWeight={300}><PhotoIcon/>
                        {loggedInUser.loggedInUser.userid===profile?._id?.$oid?(` you haven't posted anything`) :(` ${username} haven't posted anything`)}</Typography>
                      </Stack>
                    ):(
                      <Grid mt={4} container  justifyContent={'center'} alignContent={'center'} gridColumn={2} gap={2}>
                    
                      {post.map((post)=>{
                        return <Postcard 
                        username={post.username} 
                        caption={post.caption} 
                        likesCount={post.likesCount} 
                        imageUrl={`${BASE_URL}/${post.postPath}`}
                        unique_id={post._id.$oid} 
                        postedAt={post.postedAt} 
                        profilePath={post.profilePath} />
                      })
                    }
                    
                  </Grid>

                    )
                  }
                </Stack>

            </Stack>  
          
          </>

        )
      }
  
