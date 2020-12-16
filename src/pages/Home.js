import React from 'react'
import useStyles from "@styles";
import {
    Typography
} from '@material-ui/core'

function Home() {
    const classes = useStyles()

    return (
        <div className={classes.form}>
          <Typography variant="h3" className={classes.pageTitle}>
            Welcome to the LBDserver!
          </Typography>
        </div>
    )
}

export default Home
