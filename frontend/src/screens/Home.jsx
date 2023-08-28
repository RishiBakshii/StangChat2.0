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
import Lottie from 'lottie-react';


export const BASE_URL=process.env.REACT_APP_API_BASE_URL;
export const feedData=createContext()
export const feedUpdate=createContext();

export const Home =() => {
    const loggedInUser=useContext(loggedInUserContext)
    const [page,setPage]=useState(1)
    const [feed,setFeed]=useState([])
    const [loading,setLoading]=useState(false)
    const [hasMore,sethasMore]=useState(true)
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

    const updateFeed = (newPost) => {
        setFeed((prevFeed) => [newPost, ...prevFeed,]);
      };

  return (
    <feedUpdate.Provider value={updateFeed}>
    <>
    <Navbar/>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems="flex-start">
                
                <Leftbar/>

                <Stack flex={4} p={2} justifyContent={'center'} alignItems={'center'}>
                    {
                    feed.map((feed) => 
                        (
                        <Postcard key={feed._id}
                        imageUrl={`${BASE_URL}/${feed.postPath}`} 
                        username={feed.username} 
                        likesCount={feed.likes.length}
                        caption={feed.caption} 
                        unique_id={feed._id.$oid}
                        postedAt={feed.postedAt}
                        profilePath={feed.profilePath}
                        isLiked={`${feed.likes.includes(loggedInUser.loggedInUser.userid)?(1):(0)}`}
                        setLikeModalOpen={setLikeModalOpen}
                        />
                        ))
                    }
                    {
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
                    
                    }
                </Stack>
                <Rightbar/>
        </Stack>  
        <Likesmodal postid={likeModalOpen.postid} open={likeModalOpen.state} handleClose={()=>setLikeModalOpen({state:false,postid:""})}/>
        </>
    </feedUpdate.Provider>
  )
}
