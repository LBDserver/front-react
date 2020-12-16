import React from 'react'
import useStyles from '@styles'
import ProjectSelection from 'components/ProjectSelection';

const Home: React.FC = () => {
    const classes = useStyles();

    return (
        <div className={classes.page}>
            <p className={classes.pageTitle}>The Home Component</p>
            <ProjectSelection/>
        </div>
    )
}

export default Home