import React, { useContext } from "react";
import GeometryComponent from "./GeometryComponent";
import AppContext from "@context";
import url from 'url'
function Viewer(props) {
  const { context, setContext } = useContext(AppContext);

  function checkGLTFselection() {
    const gltfChecked = []
    context.activeDocuments.forEach((doc) => {
      console.log(context.currentProject.documents[doc]["rdfs:label"]);
      if (context.currentProject.documents[doc]["rdfs:label"] === "gltf") {
        console.log('doc', doc)
        const fullUrl = url.parse(doc)
        const realDocUrl = doc.replace(`${fullUrl.protocol}//${fullUrl.host}`, process.env.REACT_APP_BACKEND)

        gltfChecked.push(realDocUrl)
      }
    })
    return gltfChecked
  }  

  function setSelection(guid) {
    setContext({...context, selection: [guid]})
  }

  return (
    <div>
      <GeometryComponent
        height="96%"
        width="86%"
        models={checkGLTFselection()}
        projection="perspective"
        selectionHandler={setSelection}
        queryResults={context.selection}
      />
    </div>
  );
}

export default Viewer;
