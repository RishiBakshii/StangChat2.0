import React, { useEffect,useState ,createContext, useContext} from 'react'
import { Navbar } from '../components/Navbar'
import {Box, Stack, Typography} from '@mui/material'
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


export const BASE_URL=process.env.REACT_APP_API_BASE_URL;
export const feedData=createContext()
export const feedUpdate=createContext();

export const Home =() => {
    const loggedInUser=useContext(loggedInUserContext)
    console.log(loggedInUser)
    const [page,setPage]=useState(1)
    const [feed,setFeed]=useState([])
    const [loading,setLoading]=useState(false)
    const [hasMore,sethasMore]=useState(true)
    const [newUser,setNewUser]=useState(loggedInUser.loggedInUser.followingCount===0?true:false)
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
    <feedUpdate.Provider value={setFeed}>
    <>
    <Navbar/>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems="flex-start">
                
                <Leftbar/>

                <Stack flex={4} p={2} justifyContent={'center'} alignItems={'center'}>
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
                        isLiked={`${post.likes.includes(loggedInUser.loggedInUser.userid)?(1):(0)}`}
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
    </feedUpdate.Provider>
  )
}
