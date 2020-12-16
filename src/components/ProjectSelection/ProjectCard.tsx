import React from 'react'
import {
    Card,
    CardActions,
    CardContent,
    Button,
    Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

interface CardProps {
    description: string,
    name: string,
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

    return (
        <div className={classes.root}>
            <Card className={classes.card} variant="outlined">
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        LBDserver Project
                    </Typography>
                    <Typography variant="h5" component="h2">
                        {props.name}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {props.description}
                    </Typography>
                </CardContent>
            </Card>
            <Button className={classes.button} variant="contained" size="small" color="primary">Activate</Button>

        </div>

    )
}

export default ProjectCard
