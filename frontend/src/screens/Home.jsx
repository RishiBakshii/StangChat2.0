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
    const loggedInUser=useContext(loggedInUserContext)
    const [feed,setFeed]=useState([])

    const getFeed=async()=>{
        try {

            const response=await fetch(`${BASE_URL}/getfeed`,{
                method:"POST",
            })

            const json=await response.json()

            if(response.ok){
                setFeed(json)
            }
            if (response.status==500){
                alert(json.message)
            }
            
        } catch (error) {
            alert(error)
        }
    }

    useEffect(()=>{
        // getLoggedInUser()
        getFeed()
    },[])

    const updateFeed = (newPost) => {
        setFeed((prevFeed) => [newPost, ...prevFeed]);
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
                        <Postcard key={feed._id.$oid} 
                        imageUrl={`${BASE_URL}/${feed.postPath}`} 
                        username={feed.username} 
                        likesCount={feed.likes.length}
                        caption={feed.caption} 
                        unique_id={feed._id.$oid}
                        postedAt={feed.postedAt}
                        profilePath={feed.profilePath}
                        isLiked={feed.likes.includes(loggedInUser.userid)}
                        />
                        ))
                    }
                </Stack>

                <Rightbar/>
        </Stack>  
    </feedUpdate.Provider>
  )
}
