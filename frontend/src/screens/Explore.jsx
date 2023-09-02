import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Navbar } from '../components/Navbar';
import { Leftbar } from '../components/Leftbar';
import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../envVariables';

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

        <Leftbar/>

        <Stack padding={'1 4vw'} spacing={5}  justifyContent={'center'} alignItems={"flex-end"} mt={2}>
        <Stack>
              <ImageList sx={{"width":400}} variant="woven" cols={5} rowHeight={70}>
              {
                exploreFeed.map((data) => (

                <ImageListItem key={data._id} cols={data.cols || 1} rows={data.rows || 1}>
                <img
                {...srcset(`${BASE_URL}/${data.postPath}`, 121, data.rows, data.cols)}
                alt={data.username}
                loading="lazy"
              />
            </ImageListItem>
      ))}
          </ImageList>
        </Stack>



    </Stack>
    

    </>

  );
}
