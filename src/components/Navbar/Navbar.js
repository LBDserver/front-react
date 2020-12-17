import React from 'react'
import { AppBar, Toolbar, Typography } from '@material-ui/core'
import useStyles from '@styles'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const classes = useStyles();
    return (
        <AppBar className={classes.appBar}>
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                        <Link style={{color: "white", textDecoration: "none"}} to="/">LBDserver</Link>
                </Typography>
            </Toolbar>
        </AppBar>
    )
}

export default Navbar