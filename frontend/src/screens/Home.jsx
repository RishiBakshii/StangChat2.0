import React, { useEffect,useState ,createContext, useContext} from 'react'
import { Navbar } from '../components/Navbar'
import {Avatar, Box, Stack, Typography} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Rightbar } from '../components/Rightbar'
import { Postcard } from '../components/Postcard'
import { loggedInUserContext } from '../context/user/Usercontext'
import CircularProgress from '@mui/material/CircularProgress';
import { Likesmodal } from '../components/Likesmodal'
import { loadPost } from '../api/post'
import catanimation from '../animations/login/catanimation.json'
import welcomecat from '../animations/login/welcomecat.json'
import Lottie from 'lottie-react';
import { postContext } from '../context/posts/PostContext'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';



export const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const Home =() => {
    const loggedInUser=useContext(loggedInUserContext)
    const {feed,setFeed}=useContext(postContext)
    const [page,setPage]=useState(1)
    const [loading,setLoading]=useState(false)
    const [hasMore,sethasMore]=useState(true)
    const [newUser,setNewUser]=useState(null)
    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        setNewUser(loggedInUser.loggedInUser.followingCount === 0);
    }, [loggedInUser.loggedInUser.followingCount]);
    


    const [likeModalOpen,setLikeModalOpen]=useState({
      'state':false,
      'postid':''
    })

    useEffect(()=>{
        if(hasMore){
            getFeed()
        }
    },[page,loggedInUser])
    
    useEffect(()=>{
        window.addEventListener("scroll", handelInfiniteScroll);
        return () => window.removeEventListener("scroll", handelInfiniteScroll);
    },[])

    const handelInfiniteScroll = async() => {
        try{
            if (window.innerHeight + document.documentElement.scrollTop +1 >=document.documentElement.scrollHeight){
                setLoading(true);
                setPage((prev) => prev + 1);
            }
        }
        catch(error){
            console.log(error)
        }
      };

    const getFeed=async()=>{
            try {
            const result=await loadPost(page,loggedInUser.loggedInUser.userid)
            
            if(result.success){
                console.log(result.posts)
                if(result.posts.length!==0){
                    setFeed((prev) => [...prev, ...result.posts]);
                }
                else{
                    sethasMore(false)
                }
        }
            else{
                alert(result.message)
            }

        } catch (error) {
            console.log(error)
        }
    }


  return (
    <>
    <Navbar/>

    {/* <Stack position={'sticky'} top={0} justifyContent={'center'} alignItems={'center'}>
        <Stack direction={'row'} justifyContent={'center'} alignItems={'center'} spacing={5} p={1}>
            <Avatar sx={{"width":'6rem',height:"6rem"}}></Avatar>
            <Avatar sx={{"width":'6rem',height:"6rem"}}></Avatar>
            <Avatar sx={{"width":'6rem',height:"6rem"}}></Avatar>
            <Avatar sx={{"width":'6rem',height:"6rem"}}></Avatar>
            <Avatar sx={{"width":'6rem',height:"6rem"}}></Avatar>
            <Avatar sx={{"width":'6rem',height:"6rem"}}></Avatar>
        </Stack>
    </Stack> */}


        <Stack direction={"row"} justifyContent={"space-between"} alignItems="flex-start">
                <Leftbar />
                <Stack flex={4} p={matchesMD?0:2} justifyContent={'center'} alignItems={'center'}>
                    {
                    feed.map((post) => 
                        (
                        <Postcard key={post._id}
                        username={post.username} 
                        caption={post.caption} 
                        likesCount={post.likesCount}
                        imageUrl={`${BASE_URL}/${post.postPath}`} 
                        unique_id={post._id.$oid}
                        postedAt={post.postedAt}
                        profilePath={post.profilePath}
                        isLiked={post.likes.includes(loggedInUser.loggedInUser.userid)?(true):(false)}
                        setLikeModalOpen={setLikeModalOpen}
                        userid={post.user_id.$oid}
                        commentCount={post.commentsCount}
                        />
                        ))
                    }
                    {
                    newUser?(
                        <Stack justifyContent={'center'} alignItems={"center"}>
                            
                            <Box width={'30rem'}>
                                <Lottie animationData={welcomecat} />
                            </Box>

                            <Typography variant='body1' fontWeight={300}>hmm! you seem new🤔</Typography>
                            <Typography variant='body1' fontWeight={300}>Follow some people to see their posts</Typography>
                        </Stack>
                    ):(
                        hasMore?(
                        loading?(<CircularProgress />):("")
                    ):(
                        <Stack justifyContent={'center'} alignItems={"center"}>
                            
                            <Box width={'10rem'}>
                                <Lottie animationData={catanimation} />
                            </Box>

                            <Typography variant='body1' fontWeight={300}>You are all caught up!✅</Typography>
                            <Typography variant='body1' fontWeight={300}>Follow more users for more content🚀</Typography>
                        </Stack>
                    )
                    )
                    
                    
                    }
                </Stack>
                <Rightbar/>
        </Stack>  
        <Likesmodal postid={likeModalOpen.postid} open={likeModalOpen.state} handleClose={()=>setLikeModalOpen({state:false,postid:""})}/>
        </>
  )
}
