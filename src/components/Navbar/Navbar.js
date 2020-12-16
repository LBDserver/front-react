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
  const [currentProject, setCurrentProject] = useState("775603e6-28ad-40a4-baab-a202dcd254e5") // gravensteen
  // const [currentProject, setCurrentProject] = useState("ffeced21-3ab3-4ac0-a3ba-467118787f21") // duplex

  useEffect(() => {
    if (context.currentProject && context.currentProject.projectId) {
      setCurrentProject(context.currentProject.projectId)
    }
  }, [context.currentProject])


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

      const projectToSet = {projectId: currentProject, documents, graphs, projectMeta: parseTTL(result.data.projectGraph)}
      console.log('projectToSet', projectToSet)
      setContext({...context, currentProject: projectToSet, activeDocuments: [], activeGraphs: []})
    } catch (error) {
      console.log('error', error.message)
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
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
