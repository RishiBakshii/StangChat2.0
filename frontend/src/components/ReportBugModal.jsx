import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export const ReportBugModal=({open,handleClose})=> {

  const [isReported,setIsReported]=React.useState(false)

  const handleCloseModal=()=>{
    handleClose()
    setIsReported(true)
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Report a Problem</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Before reporting this bug please ensure that this is a genuine report and not a spam as this could help in preventing you from getting blocked by the report system
          </DialogContentText>
          <TextField
          multiline rows={4}
            autoFocus
            margin="dense"
            id="name"
            label="Describe the issue"
            type="email"
            fullWidth
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCloseModal}>Report</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}