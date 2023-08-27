import LoadingButton from '@mui/lab/LoadingButton';

export const LoadingButtons=()=> {
  return (
      <LoadingButton sx={{height:"3rem"}} loadingPosition='center' loading variant="contained" >
        Submit
      </LoadingButton>
  );
}