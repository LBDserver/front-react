import React, { useState, useContext } from "react";
import {
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "@styles";
import axios from "axios";
import AppContext from "@context";
import { Link } from "react-router-dom";
import Viewer from "@components/GeometryComponent/Viewer";

import { ProjectBrowser } from "@components";

function Project(props) {
  const { context, setContext } = useContext(AppContext);
  const { classes } = props;

  function checkGLTFselection() {
    const gltfChecked = []
    context.activeDocuments.forEach((doc) => {
      if (context.currentProject.documents[doc]["rdfs:label"] === "gltf") {
        gltfChecked.push(true)
      } else {
        gltfChecked.push(false)
      }
    })
    if (gltfChecked.includes(true)) {
      return true
    }
    return false
  
  }

  return (
    <div>
      {context.currentProject ? (
        <Grid container className={classes.form}>
          <Grid xs={3} item>
            <ProjectBrowser />
          </Grid>
          <Grid xs={9} item>
            {context.activeDocuments.length > 0 && checkGLTFselection() ? (
              <Viewer />
            ) : (
              <div style={{ margin: "200px", textAlign: "center" }}>
                <h2>Please select a glTF file in the DOCUMENTS tab</h2>
              </div>
            )}
          </Grid>
        </Grid>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default withStyles(styles)(Project);
