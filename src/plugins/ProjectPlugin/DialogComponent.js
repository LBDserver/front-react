import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  DialogContentText,
} from "@material-ui/core";
// import useStyles from "@styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { convertIFC } from "./functions";
import { uploadDocument, uploadGraph } from "lbd-server";
import AppContext from "@context";
import { makeStyles, useTheme } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  }
}));

const DialogComponent = (props) => {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);
  const [fileToUpload, setFileToUpload] = useState(null);
  const [loading, setLoading] = useState(null);
  const [docType, setDocType] = useState(null);
  const [label, setLabel] = useState();
  const [description, setDescription] = useState();
  const [uploadType, setUploadType] = useState(props.type);

  function handleInput(e) {
    e.preventDefault();
    setFileToUpload(e.target.files[0]);
  }

  async function uploadInput(e) {
    e.preventDefault();
    try {
      switch (uploadType) {
        case "ifc":
          await uploadIFCtoServer();
          break;
        case "graph":
          await uploadNamedGraphToServer();
          break;
        case "newGraph":
          await uploadNewGraphToServer();
          break;
        case "document":
          await uploadDocumentToServer();
          break;
        default:
          break;
      }
      beforeClose()
    } catch (error) {
      beforeClose(error);
    }
  }

  async function beforeClose(error) {
    setLabel("")
    setDescription("")
    setFileToUpload(null)
    props.onClose(error);

  }

  async function uploadNamedGraphToServer() {
    try {
      const response = await uploadGraph(
        {
          label,
          file: fileToUpload,
          description,
        },
        context.currentProject.id,
        context.user.token
      );
      const currentProject = context.currentProject;
      currentProject["graphs"][response.uri] = response;
      setContext({ ...context, currentProject });
      return;
    } catch (error) {
      error.message = `Unable to upload graph; ${error.message}`;
      throw error;
    }
  }

  async function uploadNewGraphToServer() {
    try {
      const response = await uploadGraph(
        { label, description },
        context.currentProject.id,
        context.user.token
      );
      const currentProject = context.currentProject;
      currentProject["graphs"][response.uri] = response;
      setContext({ ...context, currentProject });
      return;
    } catch (error) {
      error.message = `Unable to create new graph; ${error.message}`;
      throw error;
    }
  }

  async function uploadDocumentToServer() {
    try {
      const response = await uploadDocument(
        {
          label,
          file: fileToUpload,
          description,
        },
        context.currentProject.id,
        context.user.token
      );
      const currentProject = context.currentProject;
      currentProject["documents"][response.uri] = response;
      setContext({ ...context, currentProject });
      return;
    } catch (error) {
      error.message = `Unable to upload document; ${error.message}`;
      throw error;
    }
  }

  async function uploadIFCtoServer() {
    try {
      setLoading(true);
      console.log("fileToUpload", fileToUpload);
      let lbd = await convertIFC(
        fileToUpload,
        "lbd",
        "https://lbdserver.com/project/"
      );
      const lbdMeta = await uploadGraph(
        {
          label: "IFCtoLBD",
          description: `Conversion of ${fileToUpload.name} to IFC`,
          file: lbd,
        },
        context.currentProject.id,
        context.user.token
      );

      let gltf = await convertIFC(fileToUpload, "gltf", undefined);
      const gltfMeta = await uploadDocument(
        {
          label: "gltf",
          description: `Conversion of ${fileToUpload.name} to glTF`,
          file: gltf,
        },
        context.currentProject.id,
        context.user.token
      );

      const currentProject = context.currentProject;
      currentProject.documents[gltf.uri] = gltf;
      currentProject.graphs[lbd.uri] = lbd;

      setContext({ ...context, currentProject });
      setLoading(false);
      return;
    } catch (error) {
      error.message = `Unable to upload ifc file; ${error.message}. Are you sure the conversion backend is running?`;
      throw error;
    }
  }

  return (
    <div className={classes.root}>
      <Dialog
        open={props.open}
        onClose={() => beforeClose()}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">{props.text.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props.text.content}</DialogContentText>
        </DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="label"
          label="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          style={{marginLeft: 20, marginRight: 20}}
        />
        <TextField
          autoFocus
          margin="dense"
          id="description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          label="Description"
          style={{marginLeft: 20, marginRight: 20}}

        />
        <input
          display="none"
          id="contained-button-file"
          multiple
          accept={props.accept}
          type="file"
          onChange={handleInput}
          style={{
            margin: "20px",
            marginTop: "20px",
          }}
        />
        <DialogActions>
          <Button onClick={() => beforeClose()} color="primary">
            Cancel
          </Button>
          <Button
            onClick={uploadInput}
            variant="contained"
            color="secondary"
            component="span"
            startIcon={<CloudUploadIcon fontSize="large" />}
            disabled={!fileToUpload || loading}
          >
            Upload
            {loading && <CircularProgress size={20} />}{" "}
          </Button>
          {props.type === "graph" ? (
            <Button
              onClick={(e) => {
                setUploadType("newGraph")
                uploadInput(e);
              }}
              variant="contained"
              color="secondary"
              component="span"
              startIcon={<CloudUploadIcon fontSize="large" />}
              disabled={loading}
            >
              Create New
              {loading && (
                <CircularProgress size={20}/>
              )}{" "}
            </Button>
          ) : (
            <></>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogComponent;
