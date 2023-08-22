import React, { useEffect,useState ,createContext, useContext} from 'react'
import { Navbar } from '../components/Navbar'
import {Stack} from '@mui/material'
import { Leftbar } from '../components/Leftbar'
import { Rightbar } from '../components/Rightbar'
import { Postcard } from '../components/Postcard'
import { loggedInUserContext } from '../context/user/Usercontext'


export const BASE_URL=process.env.REACT_APP_API_BASE_URL;

export const feedData=createContext()
export const feedUpdate=createContext();

export const Home =() => {

    useEffect(()=>{
        getFeed()
        window.addEventListener("scroll", handleScroll);
        return ()=>{
            window.removeEventListener("scroll",handleScroll)
        }
    },[])

    const loggedInUser=useContext(loggedInUserContext)

    const [feed,setFeed]=useState([])
    const [page,setPage]=useState(1)
    const [hasMore, setHasMore] = useState(true);

    const getFeed=async()=>{
        try {
            const response=await fetch(`${BASE_URL}/getfeed`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    'page':page
                })
            })

            const json=await response.json()

            if(response.ok){
                console.log(json)
                setFeed(json)

                if (json.length > 0) {
                    updateFeed(...json)
                    setPage((prevpage)=>prevpage+1);
                } 
                else {
                    setHasMore(false);
                }
            }

            
            if (response.status==500){
                alert(json.message)
            }
            
        } catch (error) {
            alert(error)
        }
    }



    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollHeight - scrollTop === clientHeight && hasMore) {
          getFeed();
        }
      };

    const updateFeed = (newPost) => {
        setFeed((prevFeed) => [newPost, ...prevFeed,]);
      };

  return (
    <feedUpdate.Provider value={updateFeed}>
    <Navbar/>
        <Stack direction={"row"} spacing={2} justifyContent={"space-between"} alignItems="flex-start">
                
                <Leftbar/>

                <Stack flex={4} p={2}>
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
                        />
                        ))
                    }
                    {/* {hasMore && <div>Loading more posts...</div>} */}
                </Stack>

                <Rightbar/>
        </Stack>  
    </feedUpdate.Provider>
  )
}
