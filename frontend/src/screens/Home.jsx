import React, { useEffect,useState,useContext} from 'react'
import { Navbar } from '../components/Navbar'
import {Stack} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Rightbar } from '../components/Rightbar'
import { Postcard } from '../components/Postcard'
import { loggedInUserContext } from '../context/user/Usercontext'
import CircularProgress from '@mui/material/CircularProgress';
import { Likesmodal } from '../components/Likesmodal'
import { loadPost } from '../api/post'
import { postContext } from '../context/posts/PostContext'
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Newuserdisplay } from '../components/Newuserdisplay'
import { CaughtUpDisplay } from '../components/CaughtUpDisplay'
import {SnackAlert} from '../components/SnackAlert'
import { GlobalAlertContext } from '../context/globalAlert/GlobalAlertContext'
import { SERVER_DOWN_MESSAGE } from '../envVariables'


export const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const Home =() => {
    const loggedInUser=useContext(loggedInUserContext)
    const {setGlobalAlertOpen}=useContext(GlobalAlertContext)
    const {feed,setFeed}=useContext(postContext)
    const [page,setPage]=useState(1)
    const [loading,setLoading]=useState(false)
    const [hasMore,sethasMore]=useState(true)
    const [newUser,setNewUser]=useState(null)
    const theme = useTheme();
    const matchesMD = useMediaQuery(theme.breakpoints.down('md'));
    const [likeModalOpen,setLikeModalOpen]=useState({'state':false,'postid':''})
    const [usermessage,setUserMessage]=useState({
        state:false,
        message:''
    })

    useEffect(() => {
        setNewUser(loggedInUser.loggedInUser.followingCount === 0);
    }, [loggedInUser.loggedInUser.followingCount]);
    
    useEffect(()=>{
        if(hasMore){
            getFeed()
        }
    },[page,loggedInUser.loggedInUser])

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
                if(result.data.length!==0){
                    setFeed((prev) => [...prev,...result.data]);
                }
                if(result.logout){
                    setGlobalAlertOpen({state:true,message:result.message})
                }
                else{
                    sethasMore(false)
                }
            }
            else{
                setUserMessage({state:true,message:result.message})
            }

        } catch (error) {
            // setGlobalAlertOpen({ state: true, message:SERVER_DOWN_MESSAGE});
            console.log('error')
            
        }
    }


  return (
    <>
    <Navbar/>

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
                        <Newuserdisplay/>
                    ):(
                        hasMore?
                        (loading?(<CircularProgress />):("")):(
                        <CaughtUpDisplay/>
                    )
                    )
                    }
                </Stack>
                <Rightbar/>
        </Stack>  
        <Likesmodal postid={likeModalOpen.postid} open={likeModalOpen.state} handleClose={()=>setLikeModalOpen({state:false,postid:""})}/>
        <SnackAlert open={usermessage.state} message={usermessage.message}/>
        </>
  )
}
