import React, { useContext, useState } from "react";
import {
  Drawer,
  AppBar,
  Typography,
  Button,
  Tab,
  Tabs,
  Slider,
} from "@material-ui/core";
// import useStyles from "@styles";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "@context";
import { miniDrawerWidth } from "@styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import PropTypes from "prop-types";
import "./styles.css";
import "./functions.js";

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

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setContext({
      ...context,
      dataType: ["Elements", "Specifications"][newValue],
    });
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
              <h1>Building Specification Manager</h1>
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
                  <Tab label="Specifications" {...a11yProps(0)}></Tab>
                </Tabs>
              </AppBar>
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
                <h1>test</h1>
                <Button
                  //onClick={() => handleOpenUpload("document")}
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
              </TabPanel>
            </div>
          </Drawer>{" "}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
