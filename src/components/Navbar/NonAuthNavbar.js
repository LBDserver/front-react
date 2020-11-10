import React, { Fragment } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";

import { Typography, IconButton, Button, Grid, InputBase } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import SearchIcon from '@material-ui/icons/Search';
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}));

export default function MenuAppBar() {
  const classes = useStyles();

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <Button style={{paddingTop: "12px"}} color="inherit" component={Link} to="/project">
          Project
        </Button>
        <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

      </Grid>
      <Grid item>
        <Button color="inherit" component={Link} to="/login">
          Login
        </Button>
        <Button color="inherit" component={Link} to="/register">
          Register
        </Button>

        <IconButton
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
      </Grid>
    </Grid>
  );
}

// import React, { Fragment, useState } from "react";
// import { Button, Grid, IconButton, Typography, Menu, MenuItem } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
// import {AccountCircle} from "@material-ui/icons"
// import MenuIcon from "@material-ui/icons/Menu"
// import { Link } from "react-router-dom";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

// function NonAuthNavbar() {
//   const classes = useStyles();
//   const [auth, setAuth] = React.useState(true);
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);

//   return (
//     <div className={classes.root}>
//       <IconButton
//         edge="start"
//         className={classes.menuButton}
//         color="inherit"
//         aria-label="menu"
//       >
//         <MenuIcon />
//       </IconButton>
//       <Typography variant="h6" className={classes.title}>
//         Photos
//       </Typography>

//       <div>
//         <IconButton
//           aria-label="account of current user"
//           aria-controls="menu-appbar"
//           aria-haspopup="true"
//           color="inherit"
//         >
//           <AccountCircle />
//         </IconButton>
//         <Menu
//           id="menu-appbar"
//           anchorOrigin={{
//             vertical: "top",
//             horizontal: "right",
//           }}
//           keepMounted
//           transformOrigin={{
//             vertical: "top",
//             horizontal: "right",
//           }}
//           open={open}
//           onClose={e => setAnchorEl(null)}
//         >
//           <MenuItem onClick={e => setAnchorEl(null)}>Profile</MenuItem>
//           <MenuItem onClick={e => setAnchorEl(null)}>My account</MenuItem>
//         </Menu>
//       </div>
//     </div>

//     // <Fragment>
//     //   <Grid container spacing={24}>
//     //     <Grid item xs={11}>
//     //       <Button color="inherit" component={Link} to="/demo">
//     //         Demo
//     //       </Button>
//     //     </Grid>
//     //     <Grid item xs={1}>
//     //     <Button color="inherit" component={Link} to="/login">
//     //     Login
//     //   </Button>
//     //   <Button color="inherit" component={Link} to="/register">
//     //     Register
//     //   </Button>
//     //     </Grid>
//     //   </Grid>
//     // </Fragment>
//   );
// }

// export default NonAuthNavbar;
