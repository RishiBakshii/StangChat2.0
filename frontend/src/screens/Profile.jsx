import React, { useContext, useEffect, useState } from 'react'
import { Navbar } from '../components/Navbar'
import {Stack,Avatar, Typography, Button, Grid, Modal, Box, CircularProgress, useMediaQuery, useTheme} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { LoadingButtons } from '../components/LoadingButtons'
import { Editprofile } from '../components/Editprofile'
import userdoesnotexist from '../animations/userdoesnotexist.json'
import { handleApiResponse, send_push_notification } from '../utils/common'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import { BUCKET_URL, SERVER_DOWN_MESSAGE } from '../envVariables'
import theme from '../theme';
import { ThemeContext } from '../context/Theme/ThemeContext';


export const Profile = () => {
  const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
  const navigate=useNavigate()
  const theme=useTheme()
  const LG=useMediaQuery(theme.breakpoints.down("lg"))
  const is480=useMediaQuery(theme.breakpoints.down("480"))


  const {loggedInUser,setLoggedInUser} = useContext(loggedInUserContext);
  const { username = 'defaultUsername' } = useParams();
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


  const [wrongUser,setWrongUser]=useState(false)


  const [followersData,setFollowersData]=useState([])
  const [followingsData,setFollowingsData]=useState([])

  const [followerLoading,setFollowerLoading]=useState(false)
  const [followingLoading,setFollowingLoading]=useState(false)

  const [followUnfollowButtonLoader,setFollowUnfollowButtonLoader]=useState(false)


  const [open, setOpen] = useState(false)
  const [followingModalState,setFollowingModalState]=useState(false)


  const [editState,setEditState]=useState(false)


  useEffect(()=>{
    try {
      fetchProfileData()
    } catch (error) {
      console.log(error) 
    }
  },[loggedInUser])
  
  const fetchProfileData=async()=>{
    try {
      const userprofile=await fetchUserProfile(username,loggedInUser.userid)

      if(userprofile.profileData){
        setProfile(userprofile.profileData)
        setPost(userprofile.postData)

        setFollowerCount(userprofile.profileData.followerCount)
        setFollowingCount(userprofile.profileData.followingCount)
        setPostCount(userprofile.profileData.postCount)

        setIsFollowing(userprofile.profileData.isFollowing)
      }
      else{
        setWrongUser(true)
      }

    } catch (error) {
      console.log(error)
    }
    

  }
  // handled 401 ✅
  const handleFollowAndUnFollow=async()=>{
    setFollowUnfollowButtonLoader(true)
    try {
      const response=await fetch(`${BASE_URL}/followunfollow`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include",
        body:JSON.stringify({
          userid:loggedInUser.userid,
          target_user_id:profile._id.$oid
        })
      })

      const result=await handleApiResponse(response)
      if(result.success){
        setLoggedInUser({...loggedInUser,['followingCount']:result.data.updatedUserFollowingCount})
        setFollowerCount(result.data.updatedFollowerCount)
        setFollowingCount(result.data.updatedFollowingCount)
        setIsFollowing(result.data.isFollowing)

        if(result.data.follow===true && result.data.fcmToken!==''){
            send_push_notification(result.data.fcmToken,'New Follower',`${loggedInUser.username} started following you`)
        }


      }
      else if(result.logout){
        navigate("/login")
        setGlobalAlertOpen({state:true,message:result.message})
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }
      
    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
    finally{
      setFollowUnfollowButtonLoader(false)
    }
  }
// 401 handled✅
  const handleShowFollowers=async()=>{
    setFollowerLoading(true)
    setOpen(true)
    try {
      const response=await fetch(`${BASE_URL}/getfollowers`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        credentials:"include",
        body:JSON.stringify({
          'userid':profile._id.$oid
        })
      })

      const result=await handleApiResponse(response)
      if(result.success){
        setFollowersData(result.data)
      }
      else if(result.logout){
        navigate("/login")
        setGlobalAlertOpen({state:true,message:result.message})
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }

    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
    finally{
      setFollowerLoading(false)
    }
  }

  // 401 handled✅
  const handleShowFollowing=async()=>{
    setFollowingLoading(true)
    setFollowingModalState(true)
    try {
      const response=await fetch(`${BASE_URL}/getfollowing`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        credentials:"include",
        body:JSON.stringify({
          'userid':profile._id.$oid
        })
      })

      const result=await handleApiResponse(response)
      if(result.success){
        setFollowingsData(result.data)
      }
      else if(result.logout){
        navigate("/login")
        setGlobalAlertOpen({state:true,message:result.message})
      }
      else{
        setGlobalAlertOpen({state:true,message:result.message})
      }

    } catch (error) {
      console.log(error)
      setGlobalAlertOpen({state:true,message:SERVER_DOWN_MESSAGE})
    }
    finally{
      setFollowingLoading(false)
    }
  }

  const handleEditProfileClick=()=>{
    setEditState(true)
  }
  const {isDarkTheme}=useContext(ThemeContext)
  const color=isDarkTheme?theme.palette.common.white:theme.palette.common.black
  const bgcolor=isDarkTheme?theme.palette.common.black:theme.palette.background.paper

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    [theme.breakpoints.down("480")]:{
      width:"18rem",
    },
    color:color,
    bgcolor:bgcolor

  };

  return (
  <>
      <Navbar/>
      <Leftbar/>
        {
          wrongUser?(
            
            <Stack flex={"1"} spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>
              <Lottie animationData={userdoesnotexist}/>
              <Typography variant='h5' fontWeight={300}>{`${username}`} does not exist on planet Stang✨</Typography>
            </Stack>
          ):(
          
          <Stack flex={"1"} color={isDarkTheme?theme.palette.background.paper:theme.palette.common.black} spacing={5} justifyContent={'center'} alignItems={"center"} mt={5}>
                  {


                  editState?(
                  <Editprofile 
                    userid={loggedInUser.userid} 
                    heading={'Edit your profile'} 
                    editProfile={true}
                    username={loggedInUser.username} 
                    email={loggedInUser.email} 
                    bio={loggedInUser.bio} 
                    location={loggedInUser.location} 
                    profilePath={`${loggedInUser.profilePicture}`}
                    />
                  ):(
                  <Stack padding={is480?(.4):(4)}  borderRadius={'.6rem'} width={`${LG?"100%":"60%"}`} justifyContent={`${is480?("center"):("flex-start")}`} alignItems={`${is480?("center"):("flex-start")}`}>

                      {/* avatar */}
                      <Stack>
                          <Avatar sx={{width:is480?180:200,height:is480?180:200}} alt={`profile picture of ${profile.username}`} src={`${BUCKET_URL}/${profile.profilePicture}`} />
                      </Stack>
                  {/* username*/}
                  <Stack direction={'row'} alignItems={'center'} spacing={2} mt={5}>
                      <Typography variant='h4' fontWeight={300}>{profile.username}</Typography>


                      {loggedInUser.userid===profile?._id?.$oid?(
                        <Button size={`${is480?("medium"):("large")}`} onClick={handleEditProfileClick} variant='contained'>Edit Profile</Button>
                      ):(

                        followUnfollowButtonLoader?(<LoadingButtons/>):(
                          <Button onClick={handleFollowAndUnFollow} size={is480?"medium":"large"} variant='contained'>{isFollowing?("Unfollow"):("Follow")}</Button>
                        )
                      )}
                  </Stack>
                  
                  {/* bio  adn location*/}
                  <Stack mt={2} spacing={1}>

                      <Typography p={is480?1:0} variant='body1'>{profile.bio}</Typography>
                      
                      <Stack direction={'row'} justifyContent={'flex-start'}  alignItems={"flex-start"} p={0}>
                        <Typography pl={is480?1:0} variant='body1'>{profile.location}</Typography>
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
                        imageUrl={`${BUCKET_URL}/${post.postPath}`}
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
                  )}
                


                <Likesmodal postid={likeModalOpen.postid} open={likeModalOpen.state} handleClose={()=>setLikeModalOpen({state:false,postid:""})}/>

                <Modal open={open} onClose={()=>setOpen(false)}>
                  <Box sx={style} >
                    <Stack spacing={4} height={`${is480?("25rem"):("25rem")}`} sx={{overflowY:"scroll"}}>
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

                                      <Avatar sx={{"width":"3rem",height:"3rem"}} alt={data.username} src={`${BUCKET_URL}/${data.profile_picture}`} component={Link} to={`/profile/${data.username}`}/>

                                      <Stack>
                                          <Typography component={Link} sx={{ textDecoration: "none",color:color}} to={`/profile/${data.username}`} variant='h6' fontWeight={300}>{data.username}</Typography>
                                          <Typography fontWeight={300} fontSize={'.9rem'} variant='body2'>{data.location}</Typography>
                                      </Stack>

                                </Stack>
                                {/* <Stack justifyContent={'center'} alignItems={"center"}>
                                    <Button size='small' variant='outlined'>follow</Button>
                                </Stack> */}
                          </Stack>
                        })
                          )
                        )

                      }

                    </Stack>
                  </Box>
                </Modal>
                
                <Modal open={followingModalState} onClose={()=>setFollowingModalState(false)}>
                  <Box sx={style}>
                  <Stack spacing={4} height={`${is480?("25rem"):("25rem")}`} sx={{overflowY:"scroll"}}>
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

                                      <Avatar sx={{"width":"3rem",height:"3rem"}} alt={data.username} src={`${BUCKET_URL}/${data.profile_picture}`} component={Link} to={`/profile/${data.username}`}/>

                                      <Stack>
                                          <Typography component={Link} sx={{ textDecoration: "none",color:color}} to={`/profile/${data.username}`} variant='h6' fontWeight={300}>{data.username}</Typography>
                                          <Typography fontWeight={300} fontSize={'.9rem'} variant='body2'>{data.location}</Typography>
                                      </Stack>

                                </Stack>
                                {/* <Stack justifyContent={'center'} alignItems={"center"} p={1}>
                                    <Button size='small' variant='outlined'>follow</Button>
                                </Stack> */}
                          </Stack>
                        })
                          )
                        )

                      }

                    </Stack>



                  </Box>
                </Modal>

            </Stack>  
          )
        }
          

          
          </>

        )
      }
  
