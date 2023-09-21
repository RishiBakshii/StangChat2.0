import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Navbar } from '../components/Navbar';
import { Leftbar } from '../components/Leftbar';
import { Stack, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { BASE_URL, BUCKET_URL } from '../envVariables';
import { Link } from 'react-router-dom';
import theme from '../theme';

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export const Explore=()=> {

  const is480=useMediaQuery(theme.breakpoints.down("480"))
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

  const calculateColumns = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1920) {
      return 5;
    } else if (screenWidth >= 1280) {
      return 4;
    } else if (screenWidth >= 960) {
      return 3;
    } else if (screenWidth >= 600) {
      return 2;
    } else {
      return 1;
    }
  };
  
  // Inside your component
  const [columns, setColumns] = useState(calculateColumns());
  
  useEffect(() => {
    const handleResize = () => {
      setColumns(calculateColumns());
    };
  
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  return (

    <>
    <Navbar/>

    <Stack direction={"row"} justifyContent={"center"} alignItems="cener">
        <Leftbar />
        
        <Stack mt={4} flex={7} justifyContent={'center'} alignItems={'center'} p={"1rem 4vw"}> 
                <ImageList variant="standard" cols={columns} rowHeight={400}>
                {
                  exploreFeed.map((data) => (
                        <ImageListItem component={Link} to={`/profile/${data.username}`} key={data._id} cols={data.cols || 1} rows={data.rows || 1}>
                          {
                            data.postPath.toLowerCase().endsWith('.mp4')?(
                              <video control width={'100%'} {...srcset(`${BUCKET_URL}/${data.postPath}`, 121, data.rows, data.cols)}></video>
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
