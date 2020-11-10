import React, { Fragment, useContext } from "react";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import AppContext from "@context";

function AuthNavbar() {
  const { context, setContext } = useContext(AppContext);

  return (
    <Fragment>
      <Button color="inherit" component={Link} to="/">
        Home
      </Button>
      <Button
        color="inherit"
        onClick={(e) => setContext({ ...context, user: null, token: null })}
        component={Link}
        to="/"
      >
        Logout
      </Button>
    </Fragment>
  );
}

export default AuthNavbar;
