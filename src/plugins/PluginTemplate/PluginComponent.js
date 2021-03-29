import React, { useContext, useState } from "react";
import { Drawer, Typography, Slider } from "@material-ui/core";
// import useStyles from "@styles";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "@context";
import { miniDrawerWidth } from "@styles";

import { queryMultiple, queryGraphSelect, updateGraph } from "lbd-server";

const drawerWidth = "26%";
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
  },
}));

export default function MyPlugin() {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);

  function setState(state) {
    setContext({
      ...context,
      states: { ...context.states, [context.plugin]: state },
    });
  }

  const state = context.states[context.plugin];

  const queryMultipleGraphs = async (e) => {
    try {
      e.preventDefault();
      const query = "SELECT * WHERE {?s ?p ?o} LIMIT 20"
      const res = await queryMultiple(
        context.currentProject.id,
        query,
        context.currentProject.activeGraphs,
        context.user.token
      );
      console.log(`res`, res);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const querySingleGraph = async (e) => {
    try {
      e.preventDefault();
      const query = `PREFIX props: <https://w3id.org/props#>
      PREFIX bot: <https://w3id.org/bot#>
      PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
      PREFIX schema: <http://schema.org/>
      SELECT ?s ?guid
      WHERE {
          ?s a beo:Window; 
              props:globalIdIfcRoot/schema:value ?guid .
      }`
      const res = await queryGraphSelect(context.currentProject.activeGraphs[0], query, context.user.token)
      console.log(`res`, res);
    } catch (error) {
      console.log(`error`, error);
    }
  };

  const updateSingleGraph = async (e) => {
    try {
      e.preventDefault();
      const query = `PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
      INSERT DATA {
          <http://theexample.com/instances/door1> a beo:Door .
      }`
      
      console.log(`query`, query)
      const res = await updateGraph(context.currentProject.activeGraphs[0], query, context.user.token)
      console.log(`res`, res);
    } catch (error) {
      console.log(`error`, error);
    }
  }

  

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
              <Typography>This is my plugin window!</Typography>
              <button onClick={querySingleGraph}>query SELECT single</button>
              <button onClick={queryMultipleGraphs}>query SELECT multiple</button>
              <button onClick={updateSingleGraph}>query INSERT</button>
              {/* <Typography>
                Current selection:
                {(context.selection.length > 0) ? (
                  context.selection.map(item => {
                    return <p> {item.guid}</p>
                  })
                ) : (
                  <> nothing selected</>
                )}

              </Typography> */}
            </div>
          </Drawer>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
