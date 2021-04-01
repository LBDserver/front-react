import React, { useContext, useState } from "react";
import { Drawer, Typography, Slider } from "@material-ui/core";
// import useStyles from "@styles";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "@context";
import { miniDrawerWidth } from "@styles";
import { getGuid } from "../../util/functions";
import { queryMultiple, queryGraphSelect, updateGraph } from "lbd-server";
import {v4} from 'uuid'

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
      const query = `PREFIX props: <https://w3id.org/props#>
      PREFIX bot: <https://w3id.org/bot#>
      PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
      PREFIX schema: <http://schema.org/>
      SELECT ?s ?guid
      WHERE {
          ?s props:globalIdIfcRoot/schema:value ?guid .
      }`;
      const res = await queryMultiple(
        context.currentProject.id,
        query,
        context.currentProject.activeGraphs,
        context.user.token
      );
      console.log(`res`, res.results.bindings);
      return res.results.bindings;
    } catch (error) {
      console.log(`error`, error);
    }
  };

  // const querySingleGraph = async (e) => {
  //   try {
  //     e.preventDefault();
  //     const query = `PREFIX props: <https://w3id.org/props#>
  //     PREFIX bot: <https://w3id.org/bot#>
  //     PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
  //     PREFIX schema: <http://schema.org/>
  //     SELECT ?s ?guid
  //     WHERE {
  //         ?s props:globalIdIfcRoot/schema:value ?guid .
  //     }`
  //     const res = await queryGraphSelect(context.currentProject.activeGraphs[0], query, context.user.token)
  //     console.log(`res`, res);
  //   } catch (error) {
  //     console.log(`error`, error);
  //   }
  // };

  const updateSingleGraph = async (e) => {
    try {
      e.preventDefault();
      const query = `PREFIX props: <https://w3id.org/props#>
      PREFIX bot: <https://w3id.org/bot#>
      PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
      PREFIX schema: <http://schema.org/>
      SELECT ?parent ?guid
      WHERE {
          ?parent props:globalIdIfcRoot/schema:value ?guid .
      }`;

      const res = await queryMultiple(
        context.currentProject.id,
        query,
        [context.currentProject.activeGraphs[0]],
        context.user.token
      );
      const bindings = res.results.bindings;
      const total = [];
      for (const item of Object.keys(context.scene.objects)) {
        const ifcGuid = getGuid(item);
        bindings.forEach((i) => {
          if (i.guid.value === ifcGuid) {
            total.push({
              parent: i.parent.value,
              ifc: i.guid.value,
              gltf: item,
            });
          }
        });
      }
      const id = v4()
      for (const el of total) {
        const geomId = v4()
        const largerGeomId = v4()
        const query = `
        PREFIX omg: <https://w3id.org/omg#>
        PREFIX fog: <https://w3id.org/fog#>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

          INSERT DATA {
              <${el.parent}> omg:hasGeometry <${el.parent}/${geomId}> .
              <${el.parent}/${geomId}> fog:hasGltfId-meshName "${el.gltf}"^^xsd:string;
                            omg:isPartOfGeometry <${el.parent}/${largerGeomId}> .
              <${el.parent}/${largerGeomId}> fog:asGltf_v2-gltf "${context.currentProject.activeDocuments[0]}"^^xsd:anyURI
          }`;

        await updateGraph(
          context.currentProject.activeGraphs[0],
          query,
          context.user.token
        );
      }

      // console.log(`res`, res);
    } catch (error) {
      console.log(`error`, error);
    }
  };

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
              <button onClick={queryMultipleGraphs}>
                query SELECT multiple
              </button>
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
