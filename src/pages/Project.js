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
import { Link, Redirect } from "react-router-dom";
import Viewer from "@components/GeometryComponent/LBDviewer";
import url from "url";
import Plugins from "../plugins";
import {drawerWidth} from '@styles'

function Project(props) {
  const { context, setContext } = useContext(AppContext);
  const { classes } = props;
  const [collapse, setCollapse] = useState(true);

  function checkGLTFselection() {
    const gltfChecked = [];
    context.currentProject.activeDocuments.forEach((doc) => {
      if (context.currentProject.documents[doc].metadata["rdfs:label"]["@value"] === "gltf") {
        const fullUrl = url.parse(doc);
        const realDocUrl = doc.replace(
          `${fullUrl.protocol}//${fullUrl.host}`,
          process.env.REACT_APP_BACKEND
        );
        gltfChecked.push(realDocUrl);
      }
    });
    return gltfChecked;
  }

  function onSelect(guids) {
    console.log("selected elements", guids);
    setContext({ ...context, selection: guids });
  }

  return (
    <div>
      {context.currentProject ? (
        <Grid container className={classes.form}>
                    <Grid xs={3} item>
            <Plugins/>
          </Grid>
          <Grid xs={(context.plugin ? 12 : 12)} item>
            {context.currentProject.activeDocuments.length > 0 &&
            checkGLTFselection().length > 0 ? (
              <div>
                <Viewer
                  height="96%"
                  width={(context.plugin ? "100%" : "100%")}
                  // width={(context.plugin ? `${100 - parseInt(drawerWidth.substring(0, drawerWidth.length - 1)+80)}%` : "100%")}
                  models={checkGLTFselection()}
                  projection={props.projection || "perspective"}
                  onSelect={onSelect}
                  selection={context.selection}
                />
              </div>

            ) : (
              <div style={{ margin: "200px", textAlign: "center" }}>
                <h2>Please select a glTF file in the DOCUMENTS tab</h2>
              </div>
            )}
          </Grid>
        </Grid>
      ) : (
        <Redirect to="/" />
      )}
    </div>
  );
}

export default withStyles(styles)(Project);
