import React, { useContext, useState } from "react";
import {
  AppBar,
  List,
  ListItem,
  Snackbar,
  Button,
  Switch,
  FormGroup,
  Box,
  Tab,
  Tabs,
  Typography,
  FormControlLabel,
  Drawer,
  Slider,
} from "@material-ui/core";
//import useStyles from "@styles";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppContext from "@context";
import { miniDrawerWidth } from "@styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PropTypes from "prop-types";
import "./styles.css";
import "./functions.js";
import UploadDialog from "../ProjectPlugin/DialogComponent";

import SwipeableViews from "react-swipeable-views";
import QueryChangeTabsXML from "./QueryChangeTabsXML";
import QueryChangeTabsRDF from "./QueryChangeTabsRDF";

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

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

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
export default function MyPlugin() {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);
  const theme = useTheme();
  const [uploadDialog, setUploadDialog] = useState(false);
  const [value, setValue] = useState(0);
  const [error, setError] = useState(null);
  const handleChangeIndex = (index) => {
    setValue(index);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setContext({
      ...context,
      dataType: ["Elements", "Specifications"][newValue],
    });
  };

  function handleOpenUpload(type) {
    console.log(context);
    setUploadDialog(type);
  }

  function handleCloseUpload(err) {
    if (err) {
      setError(err.message);
    }
    setUploadDialog(null);
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
            <element className="Plugin-title">
              Building Specification Manager
            </element>
            <div>
              <AppBar position="static" color="default">
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example"
                  onChange={handleChange}
                  value={value}
                >
                  <Tab label="Elements" {...a11yProps(0)}></Tab>
                  <Tab label="Specifications XML" {...a11yProps(1)}></Tab>
                  <Tab label="Specifications RDF" {...a11yProps(2)}></Tab>
                </Tabs>
              </AppBar>
              <SwipeableViews
                axis={theme.direction === "rtl" ? "x-reverse" : "x"}
                index={value}
                onChangeIndex={handleChangeIndex}
              >
                <TabPanel value={value} index={0} dir={theme.direction}>
                  <Typography>
                    Selected Elements:
                    {context.selection.length > 0 ? (
                      context.selection.map((item) => {
                        return <p> {item.guid} </p>;
                      })
                    ) : (
                      <> you have to select elements! </>
                    )}
                  </Typography>
                </TabPanel>

                <TabPanel value={value} index={1} dir={theme.direction}>
                  <Button
                    onClick={() => handleOpenUpload("document")}
                    variant="contained"
                    color="secondary"
                    component="span"
                    style={{
                      bottom: 20,
                      marginTop: "5%",
                      left: "0%",
                    }}
                  >
                    Info: from .dockx to .xml
                  </Button>
                  <QueryChangeTabsXML />
                  {context.user ? (
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
                          width: "130px",
                        }}
                      >
                        Upload XML
                      </Button>
                      <UploadDialog
                        open={uploadDialog === "document" ? true : false}
                        onClose={handleCloseUpload}
                        text={{
                          title: "Upload an XML resource",
                          content: "Upload your specifications in XML format",
                        }}
                        type="graph"
                        accept="*"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </TabPanel>

                <TabPanel value={value} index={2} dir={theme.direction}>
                  <QueryChangeTabsRDF />
                  {context.user ? (
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
                          width: "130px",
                        }}
                      >
                        Upload RDF
                      </Button>
                      <UploadDialog
                        open={uploadDialog === "graph" ? true : false}
                        onClose={handleCloseUpload}
                        text={{
                          title:
                            "Upload your specifications as an RDF resource",
                          content:
                            "If your application to manage your building specifications is connected to a graph database (e.g. GraphDB), then you can export your specifications as a .ttl file'",
                        }}
                        type="graph"
                        accept="*"
                      />
                    </div>
                  ) : (
                    <div></div>
                  )}
                </TabPanel>
              </SwipeableViews>
            </div>
          </Drawer>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
