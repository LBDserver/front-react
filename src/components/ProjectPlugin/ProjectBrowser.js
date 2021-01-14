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
import { Collapse } from "@material-ui/core";


export default function ProjectBrowser() {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);
  const [collapse, setCollapse] = useState(true);

  const handleCollapse = (e) => {
    setCollapse(!collapse);
  };

  return (
    <div className={classes.root}>
      {context.currentProject ? (
        <Collapse className={classes.drawer} in={collapse} timeout="auto" unmountOnExit horizontal>
          <Drawer
          
            className={classes.drawer}
            variant="permanent"
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>test</div>
            
            <BrowserTabs />
            {context.dataType &&
            context.dataType === "graphs" &&
            context.currentProject.activeGraphs.length >= 1 ? (
              <QueryChangeTabs />
            ) : (
              <div></div>
            )}
          </Drawer>{" "}
        </Collapse>
      ) : (
        <div></div>
      )}

    </div>
  );
}
