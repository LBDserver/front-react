import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import { AppBar, List, ListItem, Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AppContext from "@context";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CircularProgress, Grid } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { uploadDocument, uploadGraph } from "lbd-server";
import CloseIcon from "@material-ui/icons/Close";
import DeleteDialog from "@components/UtilComponents/DeleteDialog";
import IFCDialog from "./DialogComponent";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
}));

export default function BrowserTabs() {
  const { context, setContext } = useContext(AppContext);
  const classes = useStyles();
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileToUpload, setFileToUpload] = useState();
  const [docLabel, setDocLabel] = useState("gltf");
  const [docDescription, setDocDescription] = useState("This is a gltf file");
  const [graphLabel, setGraphLabel] = useState("topology");
  const [graphDescription, setGraphDescription] = useState(
    "The topology of the building"
  );
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteResource, setDeleteResource] = useState(null);
  const [ifcDialog, setIfcDialog] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setContext({ ...context, dataType: ["documents", "graphs"][newValue] });
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleDocumentSelected = (e) => {
    let activeDocuments = context.currentProject.activeDocuments;
    if (!e.target.checked) {
      activeDocuments = activeDocuments.filter((item) => item !== e.target.id);
    } else {
      activeDocuments.push(e.target.id);
    }
    setContext({
      ...context,
      currentProject: { ...context.currentProject, activeDocuments },
    });
  };

  const handleGraphSelected = (e) => {
    let activeGraphs = context.currentProject.activeGraphs;

    if (e.target.checked) {
      activeGraphs.push(e.target.id);
    } else {
      activeGraphs = activeGraphs.filter((item) => item !== e.target.id);
    }
    setContext({
      ...context,
      currentProject: { ...context.currentProject, activeGraphs },
    });
  };

  function handleInput(e) {
    e.preventDefault();
    setFileToUpload(e.target.files[0]);
  }

  async function uploadInput(e, docType) {
    e.preventDefault();
    setLoading(true);
    try {
      let response, currentProject;
      switch (docType) {
        case "document":
          response = await uploadDocument(
            {
              label: docLabel,
              file: fileToUpload,
              description: docDescription,
            },
            context.currentProject.id,
            context.user.token
          );
          currentProject = context.currentProject;
          currentProject["documents"][response.uri] = response;
          setContext({ ...context, currentProject });
          break;
        case "graph":
          response = await uploadGraph(
            {
              label: graphLabel,
              file: fileToUpload,
              description: graphDescription,
            },
            context.currentProject.id,
            context.user.token
          );
          currentProject = context.currentProject;
          currentProject["graphs"][response.uri] = response;
          setContext({ ...context, currentProject });
          break;
        case "newGraph":
          response = await uploadGraph(
            { label: graphLabel, description: graphDescription },
            context.currentProject.id,
            context.user.token
          );
          currentProject = context.currentProject;
          currentProject["graphs"][response.uri] = response;
          setContext({ ...context, currentProject });
          break;
        default:
          break;
      }
      setLoading(false);
      handleCloseDialog(false);
    } catch (error) {
      console.log("error", error);
      handleCloseDialog(false);
    }
  }

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDocLabel("");
    setGraphLabel("");
    setDocDescription("");
    setGraphDescription("");
    setFileToUpload("");
  };

  function handleOpenDeleteDialog(item) {
    setDeleteResource(item);
    setOpenDeleteDialog(true);
  }

  function handleCloseDeleteDialog() {
    setOpenDeleteDialog(false);
    setDeleteResource(null);
  }

  function handleDeleteDocument(uri) {
    const activeDocuments = context.currentProject.activeDocuments.filter(
      (resource) => {
        return resource !== uri;
      }
    );
    const documents = context.currentProject.documents;
    delete documents[uri];
    setContext({
      ...context,
      currentProject: { ...context.currentProject, activeDocuments, documents },
    });
    setDeleteResource(null);
  }

  function handleDeleteGraph(uri) {
    const activeGraphs = context.currentProject.activeDocuments.filter(
      (resource) => {
        return resource !== uri;
      }
    );
    const graphs = context.currentProject.graphs;
    delete graphs[uri];
    setContext({
      ...context,
      currentProject: { ...context.currentProject, activeGraphs, graphs },
    });
    setDeleteResource(null);
  }

  function handleOpenUploadIFC(e) {
    setIfcDialog(true);
  }

  function handleCloseUploadIFC(err, lbd, gltf) {
    if (err) {
      setError(err.message);
    } else {
      const currentProject = context.currentProject;
      currentProject.documents[gltf.uri] = gltf;
      currentProject.graphs[lbd.uri] = lbd;
      setContext({ ...context, currentProject });
    }
    setIfcDialog(false);
  }

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setError(null);
  };

  return (
    <div className={classes.root}>
      {error ? (
        <Snackbar
          open={error}
          autoHideDuration={6000}
          onClose={handleErrorClose}
        >
          <Alert onClose={handleErrorClose} severity="error">
            {error}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Documents" {...a11yProps(0)} />
          <Tab label="Graphs" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <FormGroup row>
            <List dense>
              {context.currentProject &&
              Object.keys(context.currentProject.documents).length > 0 ? (
                Object.keys(context.currentProject.documents).map((item, i) => {
                  return (
                    <div key={item}>
                      <ListItem>
                        <FormControlLabel
                          key={item}
                          control={
                            <Switch
                              id={item}
                              onChange={handleDocumentSelected}
                              name="checkedB"
                              color="primary"
                              checked={context.currentProject.activeDocuments.includes(
                                item
                              )}
                            />
                          }
                          label={`${context.currentProject.documents[item].metadata["rdfs:label"]}: ${context.currentProject.documents[item].metadata["rdfs:comment"]}`}
                        />
                        {context.currentProject.documents[
                          item
                        ].permissions.includes(
                          "http://www.w3.org/ns/auth/acl#Control"
                        ) ? (
                          <Button
                            color="secondary"
                            startIcon={
                              <CloseIcon
                                fontSize="large"
                                style={{
                                  marginLeft: -25,
                                  marginBottom: 15,
                                }}
                              />
                            }
                            onClick={() => handleOpenDeleteDialog(item)}
                          />
                        ) : (
                          <></>
                        )}
                      </ListItem>
                      {openDeleteDialog ? (
                        <DeleteDialog
                          type="document"
                          uri={deleteResource}
                          onClose={handleCloseDeleteDialog}
                          open={openDeleteDialog}
                          onDelete={handleDeleteDocument}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>There are no documents in this project yet</p>
              )}
            </List>
          </FormGroup>
          {context.user ? (
            <div>
              <Button
                onClick={handleOpenDialog}
                variant="contained"
                color="secondary"
                component="span"
                startIcon={<CloudUploadIcon fontSize="large" />}
                style={{
                  bottom: 0,
                  marginTop: "5%",
                  left: "70%",
                  width: "120px",
                }}
              >
                Upload
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Upload non-RDF documents
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Upload a document to the current project
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="label"
                    label="Label"
                    value={docLabel}
                    onChange={(e) => setDocLabel(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    onChange={(e) => setDocDescription(e.target.value)}
                    value={docDescription}
                    label="Description"
                    fullWidth
                  />
                </DialogContent>
                <input
                  display="none"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={handleInput}
                  style={{
                    margin: "20px",
                    marginTop: "20px",
                  }}
                />
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => uploadInput(e, "document")}
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<CloudUploadIcon fontSize="large" />}
                    disabled={!fileToUpload || loading}
                  >
                    Upload
                    {loading && (
                      <CircularProgress
                        size={20}
                        className={classes.progress}
                      />
                    )}{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            <div></div>
          )}
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <FormGroup row>
            <List dense>
              {context.currentProject &&
              Object.keys(context.currentProject.graphs).length > 0 ? (
                Object.keys(context.currentProject.graphs).map((item, i) => {
                  return (
                    <div key={item}>
                      <ListItem>
                        <FormControlLabel
                          control={
                            <Switch
                              id={item}
                              onChange={handleGraphSelected}
                              name="checkedB"
                              color="primary"
                              checked={context.currentProject.activeGraphs.includes(
                                item
                              )}
                            />
                          }
                          label={`${context.currentProject.graphs[item].metadata["rdfs:label"]}: ${context.currentProject.graphs[item].metadata["rdfs:comment"]}`}
                        />
                        {context.currentProject.graphs[
                          item
                        ].permissions.includes(
                          "http://www.w3.org/ns/auth/acl#Control"
                        ) ? (
                          <Button
                            color="secondary"
                            startIcon={
                              <CloseIcon
                                fontSize="large"
                                style={{
                                  marginLeft: -25,
                                  marginBottom: 15,
                                }}
                              />
                            }
                            onClick={() => handleOpenDeleteDialog(item)}
                          />
                        ) : (
                          <></>
                        )}
                      </ListItem>

                      {openDeleteDialog ? (
                        <DeleteDialog
                          type="graph"
                          uri={deleteResource}
                          onClose={handleCloseDeleteDialog}
                          open={openDeleteDialog}
                          onDelete={handleDeleteGraph}
                        />
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>There are no graphs in this project yet</p>
              )}
            </List>
          </FormGroup>
          {context.user ? (
            <div>
              <Button
                onClick={handleOpenDialog}
                variant="contained"
                color="secondary"
                component="span"
                startIcon={<CloudUploadIcon fontSize="large" />}
                style={{
                  bottom: 0,
                  marginTop: "5%",
                  left: "70%",
                  width: "120px",
                }}
              >
                Upload
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  Upload RDF graphs
                </DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Upload an RDF graph to the current project
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="label"
                    label="Label"
                    value={graphLabel}
                    onChange={(e) => setGraphLabel(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="description"
                    onChange={(e) => setGraphDescription(e.target.value)}
                    value={graphDescription}
                    label="Description"
                    fullWidth
                  />
                </DialogContent>
                <input
                  display="none"
                  className={classes.input}
                  id="contained-button-file"
                  multiple
                  accept=".ttl, .rdf"
                  type="file"
                  onChange={handleInput}
                  style={{
                    margin: "20px",
                    marginTop: "20px",
                  }}
                />
                <DialogActions>
                  <Button onClick={handleCloseDialog} color="primary">
                    Cancel
                  </Button>
                  <Button
                    onClick={(e) => uploadInput(e, "newGraph")}
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<CloudUploadIcon fontSize="large" />}
                    disabled={loading}
                  >
                    Create New
                    {loading && (
                      <CircularProgress
                        size={20}
                        className={classes.progress}
                      />
                    )}{" "}
                  </Button>
                  <Button
                    onClick={(e) => uploadInput(e, "graph")}
                    variant="contained"
                    color="secondary"
                    component="span"
                    startIcon={<CloudUploadIcon fontSize="large" />}
                    disabled={!fileToUpload || loading}
                  >
                    Upload
                    {loading && (
                      <CircularProgress
                        size={20}
                        className={classes.progress}
                      />
                    )}{" "}
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          ) : (
            <div></div>
          )}
        </TabPanel>
      </SwipeableViews>
      {context.user && context.user.token ? (
        <div>
          <Button
            style={{ bottom: 30, right: 30, position: "absolute" }}
            color="primary"
            onClick={handleOpenUploadIFC}
            variant="outlined"
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon fontSize="large" />}
          >
            Convert IFC
          </Button>
          <IFCDialog open={ifcDialog} onClose={handleCloseUploadIFC} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
