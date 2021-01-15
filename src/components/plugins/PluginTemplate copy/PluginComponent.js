import React, { useContext, useState } from "react";
import {Drawer, Typography} from "@material-ui/core";
import useStyles from "@styles";
import AppContext from "@context";

export default function MyPlugin() {
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
            <div className={classes.drawerHeader}></div>
            <div>
                <Typography>
                    This is my plugin window!
                </Typography>
            </div>
          </Drawer>{" "}
          </div>
      ) : (
        <div></div>
      )}

    </div>
  );
}
