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
import useStyles from "@styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import {convertIFC} from "./functions"
import {uploadDocument, uploadGraph} from 'lbd-server'
import AppContext from '@context'

const DialogComponent = (props) => {
  // const classes = useStyles();
  const {context, setContext} = useContext(AppContext)
  const [fileToUpload, setFileToUpload] = useState(null);
  const [loading, setLoading] = useState(null);
  const [zip, setZip] = useState(null)

  function handleInput(e) {
    e.preventDefault();
    console.log("uploading");
    setFileToUpload(e.target.files[0]);
  }

  async function uploadInput(e) {
    try {
      e.preventDefault()
      console.log("uploading");
      setLoading(true)
      console.log('fileToUpload', fileToUpload)
      let lbd = await convertIFC(fileToUpload, "lbd", "https://lbdserver.com/project/")
      const lbdMeta = await uploadGraph({label: "IFCtoLBD", description: `Conversion of ${fileToUpload.name} to IFC`, file: lbd}, context.currentProject.id, context.user.token)
  
      let gltf = await convertIFC(fileToUpload, "gltf", undefined)
      const gltfMeta = await uploadDocument({label: "gltf", description: `Conversion of ${fileToUpload.name} to glTF`, file: gltf}, context.currentProject.id, context.user.token)
      setLoading(false)
      props.onClose(undefined, lbdMeta, gltfMeta)
    } catch (error) {
      error.message = `Unable to upload ifc file; ${error.message}. Are you sure the conversion backend is running?`
      props.onClose(error, undefined, undefined)
    }

  }

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Upload an IFC file</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Upload and convert an IFC file to the LBDserver. It will split up in
            an RDF graph and a glTF geometric file.
          </DialogContentText>
        </DialogContent>
        <input
                  display="none"
                  id="contained-button-file"
                  multiple
                  accept=".ifc"
                  type="file"
                  onChange={handleInput}
                  style={{
                    margin: "20px",
                    marginTop: "20px",
                  }}
                />
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={(e) => uploadInput(e, "ifc")}
            variant="contained"
            color="secondary"
            component="span"
            startIcon={<CloudUploadIcon fontSize="large" />}
            disabled={!fileToUpload || loading}
          >
            Upload
            {loading && (
              <CircularProgress size={20}/>
            )}{" "}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DialogComponent;
