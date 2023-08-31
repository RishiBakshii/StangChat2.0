import React, { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import {Stack,Avatar, Typography, Button, Grid, Modal, Box, CircularProgress} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Link, useParams } from 'react-router-dom'
import { BASE_URL} from './Home'
import { fetchUserProfile } from '../api/user'
import { Postcard } from '../components/Postcard'
import PhotoIcon from '@mui/icons-material/Photo';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { loggedInUserContext } from '../context/user/Usercontext'
import Lottie from 'lottie-react';
import ghostanimation from '../animations/ghostanimation.json'
import sleepingcat from '../animations/sleepingcat.json'
import { Likesmodal } from '../components/Likesmodal'


export const Profile = () => {

  const {loggedInUser,setLoggedInUser} = useContext(loggedInUserContext);
  const {username}=useParams()
  const [profile,setProfile]=useState({})
  const [post,setPost]=useState([])
  const [likeModalOpen,setLikeModalOpen]=useState({
    'state':false,
    'postid':''
  })

  const [followerCount,setFollowerCount]=useState()
  const [followingCount,setFollowingCount]=useState()
  const [postCount,setPostCount]=useState()
  const [isFollowing,setIsFollowing]=useState()


  const [followersData,setFollowersData]=useState([])
  const [followingsData,setFollowingsData]=useState([])

  const [followerLoading,setFollowerLoading]=useState(false)
  const [followingLoading,setFollowingLoading]=useState(false)


  const [open, setOpen] = useState(false)
  const [followingModalState,setFollowingModalState]=useState(false)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  useEffect(()=>{
    fetchProfileData()
  },[loggedInUser])
  
  const fetchProfileData=async()=>{
    const userprofile=await fetchUserProfile(username,loggedInUser.userid)
    setProfile(userprofile.profileData)
    setPost(userprofile.postData)
    console.log(userprofile.profileData)

    setFollowerCount(userprofile.profileData.followerCount)
    setFollowingCount(userprofile.profileData.followingCount)
    setPostCount(userprofile.profileData.postCount)

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
          userid:loggedInUser.userid,
          target_user_id:profile._id.$oid
        })
      })

      const json=await response.json()

      if(response.ok){
        setLoggedInUser({...loggedInUser,['followingCount']:json.updatedUserFollowingCount})
        setFollowerCount(json.updatedFollowerCount)
        setFollowingCount(json.updatedFollowingCount)
        setIsFollowing(json.isFollowing)
      }
      if(response.status===500){
        alert("internal server error")
        console.log(json.message)
      }
      if(response.status===400){
        alert(json.message)
      }
    } catch (error) {
      alert(error)
    }
  }

  const handleShowFollowers=async()=>{
    setFollowerLoading(true)
    setOpen(true)
    try {
      const response=await fetch(`${BASE_URL}/getfollowers`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          'userid':profile._id.$oid
        })
      })

      const json=await response.json()

      if(response.ok){
        setFollowersData(json)
      }
      if(response.status===400){
        alert("status 400")
      }
      if(response.status===500){
        alert("internval sever error")
      }


    } catch (error) {
      alert("frontend error")
    }
    finally{
      setFollowerLoading(false)
    }
  }

  const handleShowFollowing=async()=>{
    setFollowingLoading(true)
    setFollowingModalState(true)
    try {
      const response=await fetch(`${BASE_URL}/getfollowing`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body:JSON.stringify({
          'userid':profile._id.$oid
        })
      })

      const json=await response.json()

      if(response.ok){
        setFollowingsData(json)
      }
      if(response.status===400){
        alert("status 400")
      }
      if(response.status===500){
        alert("internval sever error")
      }

    } catch (error) {
      alert("frontend error")
    }
    finally{
      setFollowingLoading(false)
    }
  }

  return (
  <>
      <Navbar/>
      <Leftbar/>
        
          
                <Stack flex={"1"} spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>
                
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


                      {loggedInUser.userid===profile?._id?.$oid?(
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
                            <Typography sx={{"cursor":"pointer"}} onClick={handleShowFollowers} variant='h6' fontWeight={300} >{followerCount} Followers</Typography>
                            <Typography sx={{"cursor":"pointer"}} onClick={handleShowFollowing} variant='h6' fontWeight={300} >{followingCount} Following</Typography>
                            <Typography variant='h6' fontWeight={300} >{postCount} Post</Typography>
                  </Stack>
                  {
                    post.length===0?(

                      <Stack mt={2} spacing={1}>
                        <Typography variant='h6' fontWeight={300}><PhotoIcon/>
                        {loggedInUser.userid===profile?._id?.$oid?(` you haven't posted anything`) :(` ${username} haven't posted anything`)}</Typography>
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
                        profilePath={post.profilePath}
                        isLiked={post.likes.includes(loggedInUser.userid)?(true):(false)}
                        setLikeModalOpen={setLikeModalOpen}
                        userid={post.user_id.$oid}
                        commentCount={post.commentsCount}/>
                      })
                    }
                    
                  </Grid>

                    )
                  }
                </Stack>
      {/* likes modal */}
                <Likesmodal postid={likeModalOpen.postid} open={likeModalOpen.state} handleClose={()=>setLikeModalOpen({state:false,postid:""})}/>
      {/* followers modal */}
      <Modal open={open} onClose={()=>setOpen(false)}>
        <Box sx={style} >
          <Stack spacing={4} height={'25rem'} sx={{overflowY:"scroll"}}>
            <Typography variant='h6' fontWeight={300}>Followers of {username}</Typography>
            { 
              followerLoading?(<CircularProgress sx={{"alignSelf":"center",justifySelf:"center"}}/>):(
                followersData.length===0?(
                  <>
                  <Stack justifyContent={'center'} alignItems={'center'} justifySelf={'center'} alignSelf={'center'}>
                    <Box width={'18rem'} alignSelf={'center'} justifySelf={'center'}>
                      <Lottie animationData={ghostanimation}></Lottie>
                    </Box>
                      <Typography variant='body1' fontWeight={300} fontSize={'1.1rem'}>Awkward! nobody follows them🤭</Typography>
                  </Stack>
                  
                  </>
                ):(
                                followersData.map((data)=>{
                return  <Stack direction={'row'} justifyContent={'space-between'}>
                      <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>

                            <Avatar sx={{"width":"3rem",height:"3rem"}} alt={data.username} src={`${BASE_URL}/${data.profile_picture}`} component={Link} to={`/profile/${data.username}`}/>

                            <Stack>
                                <Typography component={Link} sx={{ textDecoration: "none", color: "black" }} to={`/profile/${data.username}`} variant='h6' fontWeight={300}>{data.username}</Typography>
                                <Typography fontWeight={300} fontSize={'.9rem'} variant='body2'>{data.location}</Typography>
                            </Stack>

                      </Stack>
                      <Stack justifyContent={'center'} alignItems={"center"}>
                          <Button size='small' variant='outlined'>follow</Button>
                      </Stack>
                </Stack>
              })
                )
              )

            }

          </Stack>
        </Box>
      </Modal>
      
      {/* following modal */}
      <Modal open={followingModalState} onClose={()=>setFollowingModalState(false)}>
        <Box sx={style}>
        <Stack spacing={4} height={'30rem'} sx={{overflowY:"scroll"}}>
            <Typography variant='h6' fontWeight={300}>Followings of {username}</Typography>
            { 
              followingLoading?(<CircularProgress sx={{"alignSelf":"center",justifySelf:"center"}}/>):(
                followingsData.length===0?(
                  <>
                  <Stack justifyContent={'center'} alignItems={'center'} justifySelf={'center'} alignSelf={'center'}>
                    <Box width={'18rem'} alignSelf={'center'} justifySelf={'center'}>
                      <Lottie animationData={sleepingcat}></Lottie>
                    </Box>
                      <Typography variant='body1' fontWeight={300} fontSize={'1.1rem'}>{username} follows no-one except god!</Typography>
                  </Stack>
                  
                  </>
                ):(
                                followingsData.map((data)=>{
                return  <Stack direction={'row'} justifyContent={'space-between'}>
                      <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>

                            <Avatar sx={{"width":"3rem",height:"3rem"}} alt={data.username} src={`${BASE_URL}/${data.profile_picture}`} component={Link} to={`/profile/${data.username}`}/>

                            <Stack>
                                <Typography component={Link} sx={{ textDecoration: "none", color: "black" }} to={`/profile/${data.username}`} variant='h6' fontWeight={300}>{data.username}</Typography>
                                <Typography fontWeight={300} fontSize={'.9rem'} variant='body2'>{data.location}</Typography>
                            </Stack>

                      </Stack>
                      <Stack justifyContent={'center'} alignItems={"center"} p={1}>
                          <Button size='small' variant='outlined'>follow</Button>
                      </Stack>
                </Stack>
              })
                )
              )

            }

          </Stack>



        </Box>
      </Modal>


            </Stack>  
          
          </>

        )
      }
  
