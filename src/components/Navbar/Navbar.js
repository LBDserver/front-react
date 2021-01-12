import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import AppContext from "@context";
import { makeStyles, fade } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import {checkAuthentication} from "@functions"

const useStyles = makeStyles({
  title: {
    fontSize: 14,
  },
});

const Navbar = () => {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);

  function closeProject(e) {
    e.preventDefault();
    setContext({ ...context, currentProject: undefined });
  }

  const notLoggedIn = (
    <div>
      <Button color="inherit" component={Link} to="/login">
        Login
      </Button>
      <Button color="inherit" component={Link} to="/register">
        Register
      </Button>
    </div>
  );

  const loggedIn = (
    <div>
      <Button color="inherit" component={Link} to="/projectsetup">
        Setup
      </Button>
      <Button color="inherit" onClick={logout} component={Link} to="/">
        Logout
      </Button>
    </div>
  );

  async function logout(e) {
    const config = {
      method: "post",
      url: `${process.env.REACT_APP_BACKEND}/logout`,
      headers: {
        Authorization: `Bearer ${context.token}`,
      },
    };
    console.log("config", config);

    const result = await axios(config);
    console.log("result", result);

    setContext({ ...context, user: null, token: null });
  }

  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <Typography variant="h6" noWrap>
          <Link style={{ color: "white", textDecoration: "none" }} to="/">
            LBDserver
          </Link>
        </Typography>
        <div style={{ flexGrow: 1 }} />
        {context.currentProject ? (
          <>
            <Typography style={{ marginRight: 5 }} variant="h6" noWrap>
              {context.currentProject.metadata["rdfs:label"]}
            </Typography>
            <Typography style={{ textAlign: "right" }}>
              ({context.currentProject.id})
            </Typography>
            <Button
              color="secondary"
              startIcon={
                <CloseIcon fontSize="large" style={{ color: "white" }} />
              }
              onClick={closeProject}
            />
          </>
        ) : (
          <></>
        )}
        {checkAuthentication(context) ? loggedIn : notLoggedIn}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
