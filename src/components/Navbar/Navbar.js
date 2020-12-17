import React, { useContext } from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import AppContext from "@context";
import { makeStyles, fade } from "@material-ui/core/styles";

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
});

const Navbar = () => {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            LBDserver
          </Link>
        </Typography>
        <div style={{flexGrow: 1}}/>
        {context.currentProject ? (
          <>
            <Typography style={{ marginRight: 5}} variant="h6" noWrap>
              {context.currentProject.metadata["rdfs:label"]} 
            </Typography>
            <Typography style={{ textAlign:"right"}}>({context.currentProject.id})</Typography>
          </>
        ) : (
          <></>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
