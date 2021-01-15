import React, { useContext, useState } from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import BrowserTabs from "./BrowserTabs";
import QueryChangeTabs from "./QueryChangeTabs";
import useStyles from "@styles";
import Typography from "@material-ui/core/Typography";
import AppContext from "@context";


export default function ProjectBrowser() {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);

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
            <div className={classes.drawerHeader}/>
            
            <BrowserTabs />
            {context.dataType &&
            context.dataType === "graphs" &&
            context.currentProject.activeGraphs.length >= 1 ? (
              <QueryChangeTabs />
            ) : (
              <div></div>
            )}
          </Drawer>{" "}
          </div>
      ) : (
        <div></div>
      )}

    </div>
  );
}
