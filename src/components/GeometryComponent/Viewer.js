import React, { useContext, useState, useEffect } from "react";
import GeometryComponent from "./GeometryComponentRhinoGLTF";
import AppContext from "@context";
import url from 'url'

function Viewer(props) {

  const { context, setContext } = useContext(AppContext);
  // useEffect(() => {
  //   console.log('selection', selection)
  // }, [selection])

  function checkGLTFselection() {
    // const gltfChecked = ["https://jwerbrouck.inrupt.net/public/myProjects/gravensteen/model.txt"]
    const gltfChecked = []
    context.currentProject.activeDocuments.forEach((doc) => {
      if (context.currentProject.documents[doc]["rdfs:label"] === "gltf") {
        const fullUrl = url.parse(doc)
        const realDocUrl = doc.replace(`${fullUrl.protocol}//${fullUrl.host}`, process.env.REACT_APP_BACKEND)

        gltfChecked.push(realDocUrl)
        console.log('gltfChecked', gltfChecked)
      }
    })
    return gltfChecked
  }  

  function setSelection(guid) {
    console.log('guid', guid)
    setContext({...context, selection: guid})
  }

  return (
    <div> 
      <GeometryComponent
        height="96%"
        width="86%"
        models={checkGLTFselection()}
        projection="perspective"
        selectionHandler={setSelection}
        queryResults={context.querySelection}
      />
    </div>
  );
}

export default Viewer;
