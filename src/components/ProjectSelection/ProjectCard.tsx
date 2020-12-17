import React, {useContext} from 'react'
import {
    Card,
    CardContent,
    Button,
    Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AppContext from '@context'
import { ActiveProject, Project } from 'lbdApi/interfaces';

interface CardProps {
    project: Project
    className?: string
}


const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    card: {
        height: 300,
        width: 200,
    },
    title: {
        fontSize: 14,
    },
    button: {
        position: "relative",
        bottom: 50,
        left: 20
    }
});


const ProjectCard = (props: CardProps) => {
    const classes = useStyles()
    const {context, setContext} = useContext(AppContext)

    function activateProject () {
        const project: ActiveProject = {...props.project, selection: [], acl: }
        
        setContext({...context, activeProject: props.project})
    }

    return (
        <div className={classes.root}>
            <Card className={classes.card} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        LBDserver Project
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {props.project.metadata["rdfs:label"]}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.project.metadata["rdfs:comment"]}
                    </Typography>
                </CardContent>
            </Card>
            <Button className={classes.button} variant="contained" size="small" color="primary" onClick={activateProject}>Activate</Button>

        </div>

    )
}

export default ProjectCard
