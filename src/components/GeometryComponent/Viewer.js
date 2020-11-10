import React, { useContext } from "react";
import GeometryComponent from "./GeometryComponent";
import AppContext from "@context";

function Viewer() {
  const { context, setContext } = useContext(AppContext);

  return (
    <div>
      <GeometryComponent
        height="100%"
        width="100%"
        models={["https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF/Lantern.gltf"]}
        projection="perspective"
      />
    </div>
  );
}

export default Viewer;
