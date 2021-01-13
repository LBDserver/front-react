import React, { useState, useContext, useEffect } from "react";
import * as api from "@functions";
import { useQuery } from "react-query";
import { Loading } from "../UtilComponents";
import CardGrid from "./CardGrid";
import AppContext from "@context";

const ProjectSelection = () => {
  const { context, setContext } = useContext(AppContext);

  const { isLoading: publicIsLoading, data: publicProjectData } = useQuery(
    "publicProjects",
    api.getOpenProjects
  );
  const { isLoading: isLoading, data: myProjectData } = useQuery(
    "myProjects",
    () => api.getUserProjects(context),
    { enabled: Boolean(context.user) }
  );

  const indices = []
  const projects = []
    if (publicProjectData) {
        publicProjectData.forEach(project => {
            project["open"] = true
            projects.push(project)
            indices.push(project.id)
        })
    }
  
    if (myProjectData) {
        myProjectData.forEach(project => {
            if (!indices.includes(project.id)) {
                project["open"] = false
                projects.push(project)
            }
        })
    }


  return (
    <div>
      {(publicIsLoading || isLoading) ? (
        <Loading />
      ) : (
        <>
          {(projects.length > 0) ? (
            <CardGrid projects={projects} />
          ) : (
            <div>
              <p>No projects found</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectSelection;
