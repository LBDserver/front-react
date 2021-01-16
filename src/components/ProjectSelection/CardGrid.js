import React from "react";
import { Grid } from "@material-ui/core";
import ProjectCard from "./ProjectCard";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));


const CardGrid = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={8}>
          {props.projects.map((project) => {
              if (project.permissions.includes("http://www.w3.org/ns/auth/acl#Read")) {
                return (
                    <Grid key={project.id} item>
                      <ProjectCard project={project} onDelete={props.onDelete}/>
                    </Grid>
                  );
              }
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CardGrid;
