import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import HomeIcon from "@material-ui/icons/Home";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/icons/Input";

function Navbar() {
    const authenticated = false
    return (
    <AppBar>
      <Toolbar className="nav-container">
        {authenticated ? (
          <Fragment>
            {/* <Link to="/">
              <MyButton tip="Home">
                <HomeIcon color="primary" />
              </MyButton>
            </Link> */}
            {/* <MyButton tip="Logout" onClick={this.handleLogout}>
              <Input />
            </MyButton> */}
          </Fragment>
        ) : (
          <Fragment>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Fragment>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
