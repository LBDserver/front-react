import React, { useState, useContext, useEffect } from "react";
import { getOpenProjects, getUserProjects } from "lbd-server";
import { useQuery } from "react-query";
import { Loading } from "../UtilComponents";
import CardGrid from "./CardGrid";
import AppContext from "@context";
import {checkAuthentication} from '@util/functions'

const ProjectSelection = () => {
  const { context, setContext } = useContext(AppContext);

  const {
    isLoading: publicIsLoading,
    data: publicProjectData,
    refetch: refetchPublic,
  } = useQuery("publicProjects", getOpenProjects);
  
  const {
    isLoading,
    data: myProjectData,
    refetch: refetchPersonal,
  } = useQuery("myProjects", () => getUserProjects(context.user), {
    enabled: checkAuthentication(context),
  });

  let projects = getProjects()


  async function fetchPub(e) {
    e.preventDefault()
    const projs = await getOpenProjects()
    console.log('projs', projs)
  }

  useEffect(() => {
    async function refetch() {
      await refetchPublic();
      console.log('publicProjectData', publicProjectData)
      if (checkAuthentication(context)) {
        await refetchPersonal();
        console.log('myProjectData', myProjectData)
      }
      projects = getProjects()
    }
    refetch()
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
    <div style={{marginTop: 100}}>
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
