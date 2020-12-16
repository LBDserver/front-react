import React from 'react'
import { Grid } from '@material-ui/core'
import ProjectCard from './ProjectCard'
import { makeStyles } from '@material-ui/core/styles'
import { Project } from "@interfaces"


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    }
}));

interface Props {
    projects: Project[],
    className?: string
}

const CardGrid: React.FC<Props> = (props: Props) => {
    const classes = useStyles()
    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={8}>
                    {props.projects.map((project: Project) => (
                        <Grid key={project.id} item>
                            <ProjectCard name={project.metadata["rdfs:label"]} description={project.metadata["rdfs:comment"]} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}

export default CardGrid
