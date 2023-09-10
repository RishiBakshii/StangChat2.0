import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Navbar } from '../components/Navbar';
import { Leftbar } from '../components/Leftbar';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { BASE_URL, BUCKET_URL } from '../envVariables';
import { Link } from 'react-router-dom';

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export const Explore=()=> {


  const [exploreFeed,setExploreFeed]=useState([])
  const [loading,setLoading]=useState(false)

  const fetchExploreFeed=async()=>{
    setLoading(true)
    try {
      const response=await fetch(`${BASE_URL}/getexplorefeed`,{method:"GET"})

      const json=await response.json()

      if(response.ok){
        setExploreFeed(json)
      }

      if(response.status===500){
        alert("internal server error")
      }

    } catch (error) {
      alert(error)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchExploreFeed()
  },[])


  return (

    <>
    <Navbar/>

    <Stack direction={"row"} justifyContent={"space-between"} alignItems="flex-start">
        <Leftbar />
        
        <Stack mt={1} flex={'100%'} padding={'1 4vw'} justifyContent={'center'} alignItems={'center'}>
                <ImageList variant="quilted" cols={5} rowHeight={200}>
                {
                  exploreFeed.map((data) => (
                        <ImageListItem component={Link} to={`/profile/${data.username}`} key={data._id} cols={data.cols || 1} rows={data.rows || 1}>
                          {
                            data.postPath.toLowerCase().endsWith('.mp4')?(
                              <video control width={"300px"} {...srcset(`${BUCKET_URL}/${data.postPath}`, 121, data.rows, data.cols)}></video>
                            ):(
                            <img {...srcset(`${BUCKET_URL}/${data.postPath}`, 121, data.rows, data.cols)}alt={data.username} loading="lazy"/>
                            )
                          }

                    </ImageListItem>
                    ))}

                </ImageList>
        </Stack>


    </Stack>

    </>

  );
}
