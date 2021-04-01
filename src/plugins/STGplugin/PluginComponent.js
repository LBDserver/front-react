import React, { useContext, useState, useEffect } from "react";
import {
  Drawer,
  Typography,
  Slider,
  FormControl,
  Button,
  TextField,
  CircularProgress,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

// import useStyles from "@styles";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "@context";
import { miniDrawerWidth } from "@styles";
import { getGuid } from "../../util/functions";
import { queryMultiple, queryGraphSelect, updateGraph } from "lbd-server";
import { v4 } from "uuid";
import Autocomplete from "@material-ui/lab/Autocomplete";

const drawerWidth = "33%";
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
  const [classifications, setClassifications] = useState([]);
  const [parentElement, setParentElement] = useState([]);
  const [selectedClassification, setSelectedClassification] = useState("");
  const [loading, setLoading] = useState(false);
  const [classificationOptions, setClassificationOptions] = useState([
    "fetching",
  ]);

  // only when the component is mounted
  useEffect(async () => {
    await findClassifications();
  }, []);

  useEffect(async () => {
    await findParent();
  }, [context.selection]);

  useEffect(async () => {
    await findExistingClassifications();
  }, [parentElement]);

  function setState(state) {
    setContext({
      ...context,
      states: { ...context.states, [context.plugin]: state },
    });
  }

  async function findClassifications() {
    try {
      const query = `
        PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

        SELECT ?element
        WHERE {
            ?element rdfs:subClassOf beo:BuildingElement.
        }`;

      setLoading(true);
      const result = await context.comunica.query(query, {
        sources: ["https://pi.pauwel.be/voc/buildingelement/ontology.ttl"],
      });

      // Consume results as an array (easier)
      const bindings = await result.bindings();
      setLoading(false);
      const classOptions = [];
      if (bindings.length > 0) {
        for (const result of bindings) {
          const value = result._root.entries[0][1].id;
          classOptions.push(value);
        }
        setClassifications(classOptions);
      } else {
        throw new Error("Nothing found");
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async function findParent() {
    try {
      const parentElements = [];
      if (context.selection.length > 0) {
        const sel = context.selection[0];
        for (const id of Object.keys(context.scene.objects)) {
          if (getGuid(id) === sel.guid || id === sel.guid) {
            const query = `PREFIX props: <https://w3id.org/props#>
            PREFIX bot: <https://w3id.org/bot#>
            PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
            PREFIX schema: <http://schema.org/>
            PREFIX omg: <https://w3id.org/omg#>
            PREFIX fog: <https://w3id.org/fog#>
    
            SELECT ?parent
            WHERE {
                ?parent omg:hasGeometry ?geo .
                ?geo fog:hasGltfId-meshName "${id}" .
            }`;
            setLoading(true);
            const results = await queryMultiple(
              context.currentProject.id,
              query,
              context.currentProject.activeGraphs,
              context.user.token
            );
            setLoading(false);
            if (results.results.bindings.length > 0) {
              parentElements.push({
                gltf: id,
                ifc: getGuid(id),
                parent: results.results.bindings[0].parent.value,
              });
            }
          }
        }
      }
      console.log(`parentElements`, parentElements);
      setParentElement(parentElements);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function addClassification(e) {
    e.preventDefault();
    try {
      const updateQuery = `
        PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
        INSERT DATA { GRAPH <${context.currentProject.activeGraphs[0]}> {
            <${parentElement[0].parent}> a <${selectedClassification}> .
        } }
        `;

      await updateGraph(
        context.currentProject.activeGraphs[0],
        updateQuery,
        context.user.token
      );

      const newClassifications = [...classificationOptions, selectedClassification];
      console.log(`newClassifications`, newClassifications)
      setClassificationOptions(newClassifications);
      setSelectedClassification("");
    } catch (error) {
      console.log(error);
    }
  }

  async function findExistingClassifications() {
    try {
      if (parentElement.length > 0) {
        for (const parent of parentElement) {
          const query = `
            SELECT ?class
            WHERE {
                <${parent.parent}> a ?class .
            }`;
          console.log(`query`, query);
          setLoading(true);
          const results = await queryMultiple(
            context.currentProject.id,
            query,
            context.currentProject.activeGraphs,
            context.user.token
          );
          const resultingClasses = [];
          if (results) {
            results.results.bindings.forEach((result) => {
              resultingClasses.push(result.class.value);
            });
          }
          setClassificationOptions(resultingClasses);
        }
      } else {
        setClassificationOptions([]);
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleChange = (value) => {
    try {
      new URL(value);
      setSelectedClassification(value);
    } catch (error) {}
  };

  async function establishParent(e) {
    e.preventDefault();
    try {
      const parentUri = `${context.currentProject.activeGraphs[0]}#${v4()}`;
      const geometryUri = `${context.currentProject.activeGraphs[0]}#${v4()}`;
      const updateQuery = `
      PREFIX bot: <https://w3id.org/bot#>
      PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
      PREFIX schema: <http://schema.org/>
      PREFIX omg: <https://w3id.org/omg#>
      PREFIX fog: <https://w3id.org/fog#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      INSERT DATA { GRAPH <${context.currentProject.activeGraphs[0]}> {
          <${parentUri}> omg:hasGeometry <${geometryUri}> .
          <${geometryUri}> fog:hasGltfId-meshName "${context.selection[0].guid}"^^xsd:string .
      } }
      `;
      await updateGraph(
        context.currentProject.activeGraphs[0],
        updateQuery,
        context.user.token
      );
      setSelectedClassification("");
      setParentElement([{
        gltf: context.selection[0].guid,
        parent: parentUri,
      }]);
    } catch (error) {
      console.log("error", error);
    }
  }

  const classificationDropdown = () => {
    return (
      <div>
        <FormControl>
          <Autocomplete
            id="combo-box-demo"
            options={[...classifications, selectedClassification]}
            getOptionLabel={(option) => option}
            style={{ width: 350, marginTop: "20px" }}
            onInputChange={(e, value) => handleChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                label="Add new classification"
                variant="outlined"
              />
            )}
          />
        </FormControl>
        <Button
          onClick={addClassification}
          variant="contained"
          color="secondary"
          component="span"
          startIcon={<CloudUploadIcon fontSize="large" />}
          disabled={loading}
          style={{ marginTop: 22, marginLeft: 5 }}
        >
          Upload
          {loading && <CircularProgress size={20} />}{" "}
        </Button>
      </div>
    );
  };

  const state = context.states[context.plugin];

  const currentClassifications = () => {
    return (
      <div>
        <h4>Current classifications</h4>
        <ul>
          {classificationOptions.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

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
      const id = v4();
      for (const el of total) {
        const geomId = v4();
        const largerGeomId = v4();
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
              <Typography>
                <h2 style={{ marginLeft: 10 }}>LBD-classify</h2>
                <hr/>
              </Typography>
              {context.selection && context.selection.length > 0 ? (
                <div style={{ margin: 20 }}>
                  <h4>Current selection</h4>
                  <p style={{ margin: 20 }}>{context.selection[0].guid}</p>
                  {parentElement.length > 0 ? (
                    <div>
                      {currentClassifications()}
                      {classificationDropdown()}
                    </div>
                  ) : (
                    <div style={{ margin: 20 }}>
                      {(context.currentProject.activeGraphs.length > 0) ? (
                        <div>
                        <Button
                        onClick={establishParent}
                        variant="contained"
                        color="secondary"
                        component="span"
                        startIcon={<CloudUploadIcon fontSize="large" />}
                        disabled={loading}
                      >
                        Create ROOT
                        {loading && <CircularProgress size={20} />}{" "}
                      </Button>
                      </div>
                       ) :
                      (<h4>Please select a graph in the project overview </h4>
                      )}

                    </div>
                  )}
                </div>
              ) : (
                <div style={{ margin: 20 }}>
                  <h4>no selection</h4>
                </div>
              )}
              {/* <button onClick={queryMultipleGraphs}>
                query SELECT multiple
              </button>
              <button onClick={updateSingleGraph}>query INSERT</button> */}
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
