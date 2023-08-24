import * as React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import Stack from '@mui/material/Stack';

export const LoadingButtons=()=> {
  return (
      <LoadingButton loadingPosition='center' loading={false} variant="contained" >
        Submit
      </LoadingButton>
  );
}