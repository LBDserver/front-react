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
import Viewer from '@components/GeometryComponent/Viewer'

import {ProjectBrowser} from '@components'

function Project(props) {
  const { context, setContext } = useContext(AppContext);
  const { classes } = props;

  return (
    <div>
      <Grid container className={classes.form}>
        <ProjectBrowser/>
      </Grid>
      <Grid item>
      <Viewer/>

      </Grid>
    </div>
  );
}

export default withStyles(styles)(Project);
