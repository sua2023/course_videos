import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import * as React from "react";

export default function DialogDelete(props) {
  const { open, handleClose, handleSubmit } = props;
  return (
    <React.Fragment>
      <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
        <DialogTitle>Delete item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure want to delete?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} variant="contained" color="success">Delete</Button>
          <Button onClick={handleClose} variant="contained" color="error">Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
