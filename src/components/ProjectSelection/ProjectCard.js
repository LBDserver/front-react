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
import DeleteDialog from '../UtilComponents/DeleteDialog'
import { useQuery } from "react-query";
import {getOneProject} from 'lbd-server'

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
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
      };
    
      const handleCloseDialog = () => {
        setOpenDialog(false);
      };

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
                        {(props.project.open) ? "public" : "owner"}
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
            {(props.project.permissions.includes("http://www.w3.org/ns/auth/acl#Control")) ? (
                            <Button
                            className={classes.button} variant="contained" size="small" color="primary" 
                            style={{marginLeft: 10}}
                            onClick={handleOpenDialog}
                        >Delete</Button>
                ) : (
                    <></>
                )}
                {(openDialog ? (
                    <DeleteDialog type="project" uri={props.project.uri} onClose={handleCloseDialog} open={openDialog} onDelete={props.onDelete}/>
                ) : (
                   <></> 
                ))}
            </div>
            )}
        </div>

    )
}

export default ProjectCard
