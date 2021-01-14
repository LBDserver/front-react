import React, { useContext, useState, useEffect } from "react";
import Viewer from "./GeometryComponentRhinoGLTF";
import AppContext from "../ProjectPlugin/node_modules/@context";

// function Viewer(props) {
//   function setSelection(guid) {
//     console.log('guidsqdfqdf', guid)
//   }

//   return (
//     <div>
//       <Viewer
//         height={props.height || "96%"}
//         width={props.width || "86%"}
//         models={props.models}
//         projection={props.projection || "perspective"}
//         onSelect={props.onSelect || setSelection}
//         queryResults={props.selection}
//       />
//     </div>
//   );
// }

// export default Viewer;
