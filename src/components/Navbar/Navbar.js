import React, { useContext, useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MoreIcon from "@material-ui/icons/MoreVert";
import useStyles from "@styles";
import { Link } from "react-router-dom";
import AppContext from "@context";
import {checkAuthentication, setConfig} from '@util/functions'
import axios from 'axios'
import url from 'url'
import {parse as parseTTL} from '@frogcat/ttl2jsonld'


function Navbar() {
  const classes = useStyles();
  const { context, setContext } = useContext(AppContext);
  const [currentProject, setCurrentProject] = useState("30dfbe4d-fbff-45a3-b543-caa412d06ab0")

  useEffect(() => {
    if (context.currentProject && context.currentProject.projectId) {
      setCurrentProject(context.currentProject.projectId)
    }
  }, [context.currentProject])


  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

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

  async function logout(e) {
    const config = {
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND}/logout`,
      headers: {
        'Authorization': `Bearer ${context.token}`
      }
    }
    console.log('config', config)

    const result = await axios(config)
    console.log('result', result)

    setContext({ ...context, user: null, token: null })
  }

  const loggedIn = (
    <div>
            <Button color="inherit" component={Link} to="/projectsetup">
        Setup
      </Button>
      <Button
        color="inherit"
        onClick={logout}
        component={Link}
        to="/"
      >
        Logout
      </Button>

    </div>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  async function fetchProject() {
    try {
      const result = await axios(setConfig(context, `${process.env.REACT_APP_BACKEND}/lbd/${currentProject}`))

      const documents = {}
      const graphs = {}

      for (const docUrl of result.data.documents) {
        const fullUrl = url.parse(docUrl)
        const doc = docUrl.replace(`${fullUrl.protocol}//${fullUrl.host}`, process.env.REACT_APP_BACKEND)
        const metaConfig = await axios(setConfig(context, `${doc}.meta`))
        const metaJSON = parseTTL(metaConfig.data.graph)

        documents[docUrl] = metaJSON
      }

      for (const graphUrl of result.data.graphs) {
        const fullUrl = url.parse(graphUrl)
        const graph = graphUrl.replace(`${fullUrl.protocol}//${fullUrl.host}`, process.env.REACT_APP_BACKEND)
        const metaConfig = await axios(setConfig(context, `${graph}.meta`))
        const metaJSON = parseTTL(metaConfig.data.graph)

        graphs[graphUrl] = metaJSON
      }
      setContext({...context, currentProject: {projectId: currentProject, documents, graphs, projectMeta: parseTTL(result.data.projectGraph)}})
    } catch (error) {
      console.log('error', error)
      setContext({...context, currentProject: null})

    }
  }

  return (
    <div className={classes.grow}>
      <AppBar className={classes.appBar} position="fixed">
        <Toolbar>
          <Typography as={Link} to="/" className={classes.title} variant="h6" noWrap>
          <Link to="/" variant="h6" style={{color: "white", textDecoration: "none"}} color="inherit">
    LBDserver
  </Link>
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search project…"
              value={currentProject}
              onChange={e => setCurrentProject(e.target.value)}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ "aria-label": "search" }}
            />
            <Button color="inherit" onClick={fetchProject}>Search</Button>
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
          {checkAuthentication(context) ? loggedIn : notLoggedIn}
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}

export default Navbar;
