import React, { useState, useContext } from "react";
import { deleteGraph, deleteDocument, deleteProject } from "lbd-server";
import AppContext from "@context";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { CircularProgress, Grid, Button } from "@material-ui/core"
import useStyles from "@styles";

const DeleteDialog = (props) => {
  const [loading, setLoading] = useState(false);
  const { context, setContext } = useContext(AppContext);
  const [error, setError] = useState();
  const classes = useStyles();

  async function deleteResource() {
    try {
      setLoading(true);
      switch (props.type) {
        case "project":
          await deleteProject(props.uri, context.user.token);
          props.onDelete(props.uri)
          break;
        case "document":
            console.log('deleting document', props.uri)
            await deleteDocument(props.uri, context.token)
            props.onDelete(props.uri)
          break;
        case "graph":
            await deleteGraph(props.uri, context.token)
            props.onDelete(props.uri)
          break;
        default:
          break;
      }
      setLoading(false);
      props.onClose();
    } catch (error) {
        throw error
      setError(error.message);
    }
  }
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete {props.type}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to completely remove this {props.type}?
          </DialogContentText>
          {error ? <DialogContentText>{error}</DialogContentText> : <></>}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={deleteResource}
            variant="contained"
            color="secondary"
            component="span"
            disabled={loading}
          >
            Delete
            {loading && (
              <CircularProgress size={20} className={classes.progress} />
            )}{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteDialog;
