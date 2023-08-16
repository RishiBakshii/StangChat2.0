import React, { useState } from 'react'
import { Avatar, Box,Button,Stack,TextField,Typography,styled} from '@mui/material'

const Custominput=styled('input')({
    height:"100%",
    width:"100%",
    cursor:"pointer"
})

export const Buildyourprofile = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const imageFile = event.target.files[0];
        if (imageFile) {
          const imageUrl = URL.createObjectURL(imageFile);
          setSelectedImage(imageUrl);
        }
      };
  return (
    <>
    <Stack height={'100vh'} bgcolor={'#191902'} justifyContent={'center'} alignItems={'center'}>
        <Typography gutterBottom variant='h3' fontWeight={900} color={'white'}>Lets build your profile</Typography>

        {/* box */}
        <Stack padding={'1rem 2rem'} bgcolor={'white'} width={'50rem'} borderRadius={'.6rem'} justifyContent={'flex-start'} alignItems={"center"}>

            <Stack spacing={2} justifyContent={'center'} alignItems={'center'}>

                <Box zIndex={1} sx={{opacity:0}} position={'absolute'} width={150} height={150} >
                    <Custominput  accept="image/*" type="file" onChange={handleImageChange} id="profile-image-input"/>
                </Box>
                    <Avatar alt="profile-picture" src={selectedImage} sx={{ width: 150, height: 150 }}/>
                <Typography variant='h6' fontWeight={300}>{selectedImage?("Profile Looks Nice😎"):("Select a Profile Picture")}</Typography>

            </Stack>

            <Stack mt={4} width={"70%"} spacing={2}>
                <TextField label="username" variant="outlined"  defaultValue={username}/>
                <TextField label="email" variant="outlined" defaultValue={email} />
                <TextField label="Bio" multiline rows={4} defaultValue=""/>
                <TextField label="Location" variant="outlined" defaultValue={location} />
            </Stack>

            <Box mt={5}>
                <Button variant='contained'>Save and continue</Button>
            </Box>
        </Stack>
    </Stack>
    </>
  )
}
