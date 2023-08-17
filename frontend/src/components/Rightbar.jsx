import React from 'react'
import { Box,Typography } from '@mui/material'

export const Rightbar = () => {
  return (
    <>
    <Box mt={4}>
        <Typography variant='h4' fontWeight={200}>Latest Updates</Typography>
        <Typography variant='h6' fontWeight={200}>Some News will be shown here</Typography>
    </Box>

    <Box mt={4}>
    <Typography variant='h4' fontWeight={200}>User Suggestions</Typography>
    <Typography variant='h6' fontWeight={200}>based on mutual friends or similar users. Recommendations will be shown here</Typography>

    </Box>
    </>
  )
}
