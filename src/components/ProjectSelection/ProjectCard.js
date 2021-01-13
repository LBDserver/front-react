import React, {useContext, useState} from 'react'
import {
    Card,
    CardContent,
    Button,
    Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import AppContext from '@context'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles({
    card: {
        height: 300,
        width: 200,
    },
    title: {
        fontSize: 14,
    },
    button: {
        bottom: 50,
    }
});


const ProjectCard = (props) => {
    const classes = useStyles()
    const [projectClicked, setProjectClicked] = useState(false)
    const {context, setContext} = useContext(AppContext)
    console.log('props.project', props.project)
    function activateProject () {
        setContext({...context, currentProject: {...props.project, activeGraphs: [], activeDocuments: []}})
        setProjectClicked(true)
    }

    return (
        <div>
            {(projectClicked) ? (
                <Redirect to="/project" />
            ) : (
                <div>

                <Card className={classes.card} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        {(props.project.open) ? "public" : "personal"}
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
            )}
        </div>

    )
}

export default ProjectCard
