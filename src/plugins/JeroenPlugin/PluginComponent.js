import React, { useContext, useState } from "react";
import { Drawer, Typography, Slider } from "@material-ui/core";
// import useStyles from "@styles";
import { makeStyles } from '@material-ui/core/styles';
import AppContext from "@context";
import {miniDrawerWidth} from '@styles'
import ThePlugin from './components'

const drawerWidth = "26%"
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 1,
  },
  drawerPaper: {
    width: drawerWidth,
    marginLeft: miniDrawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  }
}));

export default function MyPlugin() {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);

  function setState(state) {
    setContext({...context, states: {...context.states, [context.plugin]: state}})
  }

  const state = context.states[context.plugin]

  return (
    <div className={classes.root}>
      {context.currentProject ? (
        <div>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}></div>
            <div>
              <ThePlugin/>
            </div>
          </Drawer>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
