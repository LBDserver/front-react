import React from 'react'
import useStyles from "@styles";
import {
    Typography
} from '@material-ui/core'
import {ProjectSelection} from '@components'

function Home() {
    const classes = useStyles()

    return (
        <div className={classes.form}>
          <Typography variant="h3" className={classes.pageTitle}>
            Welcome
          </Typography>
          <Typography style={{marginTop: -20,fontWeight: "bold"}}>
          ... to the LBDserver demo!
          </Typography>
          <Typography style={{margin: "50px auto 120px auto", maxWidth: 750}}>
          This is a demo page where you can try out the (work in progress) functionality of the <a href="https://github.com/lbdserver">LBDserver</a> project. You can find some publicly accessible projects below. Simply activate one of the projects and start visualising your LBD queries. Come back to this page using the navigation bar "LBDserver" link.
          </Typography>
          <ProjectSelection/>
        </div>
    )
}

export default Home
