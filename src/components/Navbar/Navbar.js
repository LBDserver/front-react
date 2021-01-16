import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import AppContext from "@context";
import { makeStyles, fade } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import { checkAuthentication } from "@util/functions";
import { logout as logoutLBD } from "lbd-server";

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
    setContext({ ...context, currentProject: null });
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
    await logoutLBD(context.user.token);
    setContext({ ...context, user: null, currentProject: null });
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
            <Link
              style={{ color: "white", textDecoration: "none" }}
              to="/project"
            >
              <Typography style={{ marginRight: 5 }} variant="h6" noWrap>
                {context.currentProject.metadata["rdfs:label"]}
              </Typography>
            </Link>

            <Button
              color="secondary"
              startIcon={
                <CloseIcon
                  fontSize="large"
                  style={{ color: "white", marginLeft: -25, marginBottom: 15 }}
                />
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
