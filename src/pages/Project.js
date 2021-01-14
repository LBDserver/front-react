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
import Viewer from "@components/GeometryComponent/GeometryComponentRhinoGLTF";
import url from "url";
import { ProjectBrowser, PluginDrawer } from "@components";

function Project(props) {
  const { context, setContext } = useContext(AppContext);
  const { classes } = props;
  const [collapse, setCollapse] = useState(true);

  const handleCollapse = (e) => {
    setCollapse(!collapse);
  };

  function checkGLTFselection() {
    const gltfChecked = [];
    context.currentProject.activeDocuments.forEach((doc) => {
      if (context.currentProject.documents[doc]["rdfs:label"] === "gltf") {
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

  function onSelect(guid) {
    console.log("selected element with guid", guid);
    setContext({ ...context, selection: guid });
  }

  return (
    <div>
      {context.currentProject ? (
        <Grid container className={classes.form}>
                    <Grid xs={1} item>
            <PluginDrawer/>
          </Grid>
          <Grid xs={3} item>
            <ProjectBrowser />
          </Grid>
          <Grid xs={8} item>
            {context.currentProject.activeDocuments.length > 0 &&
            checkGLTFselection().length > 0 ? (
              <Viewer
                height="96%"
                width="86%"
                models={checkGLTFselection()}
                projection={props.projection || "perspective"}
                onSelect={onSelect}
                selection={context.querySelection}
              />
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
