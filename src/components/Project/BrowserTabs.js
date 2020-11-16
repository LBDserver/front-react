import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios"
import AppBar from "@material-ui/core/AppBar";
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

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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
          <Typography>{children}</Typography>
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
  const [fileToUpload, setFileToUpload] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setContext({ ...context, dataType: ["documents", "graphs"][newValue] });
  };

  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleDocumentSelected = (e) => {
    let activeDocuments = context.activeDocuments;

    if (e.target.checked) {
      activeDocuments.push(e.target.id);
      setContext({ ...context, activeDocuments });
    } else {
      activeDocuments = activeDocuments.filter((item) => item !== e.target.id);
      setContext({ ...context, activeDocuments });
    }
  };

  const handleGraphSelected = (e) => {
    let activeGraphs = context.activeGraphs;

    if (e.target.checked) {
      activeGraphs.push(e.target.id);
      setContext({ ...context, activeGraphs });
    } else {
      activeGraphs = activeGraphs.filter((item) => item !== e.target.id);
      setContext({ ...context, activeGraphs });
    }
  };

  function handleInput(e) {
    e.preventDefault();
    setFileToUpload(e.target.files);
    console.log("e.target.files", e.target.files);
  }

  function uploadInput(e, docType) {
    e.preventDefault();
    try {
      console.log("uploading", docType);


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
  };

  return (
    <div className={classes.root}>
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
            {context.currentProject &&
            Object.keys(context.currentProject.documents).length > 0 ? (
              Object.keys(context.currentProject.documents).map((item, i) => {
                return (
                  <FormControlLabel
                    key={item}
                    control={
                      <Switch
                        id={item}
                        onChange={handleDocumentSelected}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={`${item} (${context.currentProject.documents[item]["rdfs:label"]})`}
                  />
                );
              })
            ) : (
              <p>There are no documents in this project yet</p>
            )}
          </FormGroup>
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
                id="name"
                label="Label"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="name"
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
              accept=".ttl, .rdf, .jsonld"
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
                disabled={!fileToUpload.length}
              >
                Upload
              </Button>
            </DialogActions>
          </Dialog>
        </TabPanel>

        <TabPanel value={value} index={1} dir={theme.direction}>
          <FormGroup row>
            {context.currentProject &&
            Object.keys(context.currentProject.graphs).length > 0 ? (
              Object.keys(context.currentProject.graphs).map((item, i) => {
                return (
                  <FormControlLabel
                    key={item}
                    control={
                      <Switch
                        id={item}
                        onChange={handleGraphSelected}
                        name="checkedB"
                        color="primary"
                      />
                    }
                    label={item}
                  />
                );
              })
            ) : (
              <p>There are no graphs in this project yet</p>
            )}
          </FormGroup>
          <Button
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
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
