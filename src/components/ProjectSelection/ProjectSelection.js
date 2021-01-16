import React, { useState, useContext, useEffect } from "react";
import { getOpenProjects, getUserProjects } from "lbd-server";
import { useQuery } from "react-query";
import { Loading } from "../UtilComponents";
import CardGrid from "./CardGrid";
import AppContext from "@context";

const ProjectSelection = () => {
  const { context, setContext } = useContext(AppContext);

  const {
    isLoading: publicIsLoading,
    data: publicProjectData,
    refetch: refetchPublic,
  } = useQuery("publicProjects", getOpenProjects);
  const {
    isLoading: isLoading,
    data: myProjectData,
    refetch: refetchPersonal,
  } = useQuery("myProjects", () => getUserProjects(context.user.token), {
    enabled: Boolean(context.user),
  });

  let projects = getProjects()

  useEffect(async () => {
    await refetchPublic();
    if (context.user) {
      await refetchPersonal();
    }
    projects = getProjects()

  }, [context.user]);

  function getProjects() {
    const theProjects = [];
    const indices = [];

    if (context.user && myProjectData) {
      myProjectData.forEach((project) => {
        project["open"] = false;
        theProjects.push(project);
        indices.push(project.id);
      });
    }

    if (publicProjectData) {
      publicProjectData.forEach((project) => {
        if (!indices.includes(project.id)) {
          project["open"] = true;
          theProjects.push(project);
        }
      });
    }
    return theProjects;
  };


  function onProjectDelete(deletedUri) {
    refetchPersonal();
    refetchPublic();
    if (context.currentProject && context.currentProject.uri === deletedUri) {
      setContext({ ...context, currentProject: null });
    }
  }

  return (
    <div>
      {publicIsLoading || isLoading ? (
        <Loading />
      ) : (
        <>
          {projects.length > 0 ? (
            <CardGrid projects={projects} onDelete={onProjectDelete} />
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
