import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { AppBar, List, ListItem, Snackbar, Button, Switch, FormGroup, Box, Tab, Tabs, Typography, FormControlLabel } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CloseIcon from "@material-ui/icons/Close";
import DeleteDialog from "@components/UtilComponents/DeleteDialog";
import UploadDialog from "./DialogComponent";
import AppContext from "@context";
import {parse} from '@frogcat/ttl2jsonld'

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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteResource, setDeleteResource] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
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

  function handleOpenUpload(type) {
    setUploadDialog(type);
  }

  function handleCloseUpload(err) {
    if (err) {
      setError(err.message);
    }
    setUploadDialog(null);
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
                          label={`${parse(context.currentProject.documents[item].metadata)["rdfs:label"]}: ${parse(context.currentProject.documents[item].metadata)["rdfs:comment"]}`}
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
          {context.currentProject.permissions.includes("http://www.w3.org/ns/auth/acl#Write") ? (
            <div>
              <Button
                onClick={() => handleOpenUpload("document")}
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
              <UploadDialog open={(uploadDialog === "document") ? true : false} onClose={handleCloseUpload} text={{title: "Upload a non-RDF resource", content: "Upload a document to the current project."}} type="document" accept="*"/>
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
                          label={`${parse(context.currentProject.graphs[item].metadata)["rdfs:label"]}: ${parse(context.currentProject.graphs[item].metadata)["rdfs:comment"]}`}
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
          {context.currentProject.permissions.includes("http://www.w3.org/ns/auth/acl#Write") ? (
            <div>
              <Button
                onClick={() => handleOpenUpload("graph")}
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
              <UploadDialog open={(uploadDialog === "graph") ? true : false} onClose={handleCloseUpload} text={{title: "Upload an RDF graph", content: "Upload an RDF graph to the current project or create an empty graph"}} type="graph" accept=".ttl, .rdf"/>
            </div>
          ) : (
            <div></div>
          )}
        </TabPanel>
      </SwipeableViews>
      {context.currentProject.permissions.includes("http://www.w3.org/ns/auth/acl#Write") ? (
        <div>
          <Button
            style={{ bottom: 30, right: 30, position: "absolute" }}
            color="primary"
            onClick={() => handleOpenUpload("ifc")}
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon fontSize="large" />} 
          >
            Convert IFC
          </Button>
          <UploadDialog open={(uploadDialog === "ifc") ? true : false} onClose={handleCloseUpload} text={{title: "Upload an IFC file", content: "Upload an IFC file to the LBDserver.  It will split up in an RDF graph and a glTF geometric file."}} type="ifc" accept=".ifc"/>
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
