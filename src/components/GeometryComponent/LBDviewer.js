import React, { Component } from "react";
import { Viewer } from "@xeokit/xeokit-sdk/src/viewer/Viewer";
import { GLTFLoaderPlugin } from "@xeokit/xeokit-sdk/src/plugins/GLTFLoaderPlugin/GLTFLoaderPlugin";
import { NavCubePlugin } from "@xeokit/xeokit-sdk/src/plugins/NavCubePlugin/NavCubePlugin";
import { SectionPlanesPlugin } from "@xeokit/xeokit-sdk/src/plugins/SectionPlanesPlugin/SectionPlanesPlugin";
import PropTypes from "prop-types";
import "./layout.css";
import { v4 } from "uuid";
import {getGuid} from '../../util/functions'

export default class LBDviewer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    const viewer = this.setViewer();
    // let extension = this.props.model.split('.')
    //extension = extension[extension.length - 1]
    let extension = "gltf";

    let loader;
    if (extension.toLowerCase() === "gltf") {
      loader = new GLTFLoaderPlugin(viewer);
    } // else if (extension.toLowerCase() === 'xkt') {
    //     loader = new XKTLoaderPlugin(viewer)
    //     modelProps.metaModelSrc = this.props.metaModel
    // }

    new NavCubePlugin(viewer, {
      canvasId: "myNavCubeCanvas",
      visible: true,
    });

    const sectionPlanes = new SectionPlanesPlugin(viewer, {
        overviewCanvasId: "mySectionPlanesOverviewCanvas",
        overviewVisible: true
    });

    sectionPlanes.createSectionPlane({
        id: "mySectionPlaneY",
        pos: [0, -3, 0],
        dir: [1.0, 0.0, 0.0]
    });

    sectionPlanes.createSectionPlane({
        id: "mySectionPlaneZ",
        pos: [0, 3, 0],
        dir: [0.0, -1, 0]
    });

    sectionPlanes.createSectionPlane({
        id: "mySectionPlaneX",
        pos: [0,0, 5],
        dir: [0.0, 0, -1]
    });
    this.props.models.forEach((src) => {
      const modelProps = {
        id: v4(),
        src,
        edges: true,
        performance: true,
      };
      const model = loader.load(modelProps);

      model.on("loaded", () => {
        viewer.cameraFlight.jumpTo(model);
      });
    });

    const scene = viewer.scene;
    const camera = scene.camera;
    camera.projection = this.props.projection || "ortho";

    var lastEntity = null;
    var lastOpacity = null;

    console.log(`this.props.context`, this.props.context)
    this.props.setScene(viewer.scene)

    viewer.scene.input.on("mousemove", function (coords) {
      var hit = viewer.scene.pick({
        canvasPos: coords,
      });
      if (hit) {
        if (!lastEntity || hit.entity.id !== lastEntity.id) {
          if (lastEntity) {
            lastEntity.opacity = null;
          }

          lastEntity = hit.entity;
          lastOpacity = hit.entity.opacity;

          hit.entity.opacity = 0.6;
        }
      } else {
        if (lastEntity) {
          lastEntity.opacity = null;
          lastEntity = null;
        }
      }
    });

    var lastEntityColorize = null;
    var lastColorize = null;

    viewer.cameraControl.on("picked", async (pickResult) => {
      if (
        !lastEntityColorize ||
        pickResult.entity.id !== lastEntityColorize.id
      ) {
        if (pickResult.entity) {
          try {
            pickResult.entity.highlighted = 1;
            let ifcGuid;
            if (extension.toLowerCase() === "gltf") {
              ifcGuid = getGuid(pickResult.entity.id);
            } else if (extension.toLowerCase() === "xkt") {
              ifcGuid = pickResult.entity.id;
            }

            // if (lastEntityColorize) {
            //     lastEntityColorize.colorize = lastColorize;
            // }

            let entities = this.state.viewer.scene.objects;
            Object.keys(entities).forEach((ent) => {
              if (entities[ent].id !== pickResult.entity.id) {
                entities[ent].highlighted = false;
              }
            });

            if (ifcGuid === "0000000000000000000000") {
              // this.setState({ selection: [pickResult.entity.id] })

              this.props.onSelect([{ guid: pickResult.entity.id }]);
            } else {
              // this.setState({ selection: [pickResult.entity.id] })
              this.props.onSelect([{ guid: ifcGuid }]);
            }
          } catch (error) {
            this.setState({ selection: [] });
          }
        }

        // lastEntityColorize = pickResult.entity;
        // lastColorize = pickResult.entity.colorize.slice();
        // pickResult.entity.colorize = [0.0, 1.0, 0.0];
      }
    });

    viewer.cameraControl.on("pickedNothing", () => {
      let entities = this.state.viewer.scene.objects;
      Object.keys(entities).forEach((ent) => {
        entities[ent].highlighted = false;
      });
      this.setState({ selection: [] });
      this.props.onSelect([]);

      // if (lastEntityColorize) {
      //     lastEntityColorize.colorize = lastEntityColorize;
      //     lastEntityColorize = null;
      // }
    });

    this.setState({ viewer });
  };

  getGltfGuids = () => {
    let entities = this.state.viewer.scene.objects;
    console.log(`entities`, entities)
    let results = [];
    this.props.selection.forEach((object) => {
      results.push(object.guid);
    });



  };

  componentDidUpdate = () => {
    let entities = this.state.viewer.scene.objects;
    if (
      this.props.selection &&
      this.props.selection !== this.state.lastQueried
    ) {
      let results = [];
      this.props.selection.forEach((object) => {
        results.push(object.guid);
      });
      Object.keys(entities).forEach((ent) => {
        // let extension = this.props.models.split('.')
        // extension = extension[extension.length - 1]
        const extension = "gltf";
        let objectGuid;
        if (extension.toLowerCase() === "gltf") {
          // in case of ifc
          objectGuid = getGuid(entities[ent].id);
          if (objectGuid === "0000000000000000000000") {
            objectGuid = entities[ent].id;
          }

          // in case of stg
          // console.log('objectGuid', objectGuid)
        }
        // } else if (extension.toLowerCase() === 'xkt') {
        //     objectGuid = entities[ent].id
        // }
        if (results.includes(objectGuid)) {
          entities[ent].highlighted = true;
        } else {
          entities[ent].highlighted = false;
        }
      });

      this.setState({
        lastQueried: this.props.selection,
        selection: this.props.selection,
      });
    }
  };

  setViewer = () => {
    const viewer = new Viewer({
      canvasId: "myCanvas",
      transparent: true,
    });
    return viewer;
  };

  render() {
    return (
      <div
        className="modelContainer"
        style={{ width: this.props.width, height: this.props.height }}
      >
        <canvas
          id="myCanvas"
          style={{ width: this.props.width, height: this.props.height }}
        ></canvas>
        <canvas className="navCube" id="myNavCubeCanvas"></canvas>
        <canvas
          id="mySectionPlanesOverviewCanvas"
          className="sections"
        ></canvas>
      </div>
    );
  }
}

LBDviewer.propTypes = {
  projection: PropTypes.oneOf(["ortho", "perspective"]),
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  models: PropTypes.array.isRequired,
  metaModel: PropTypes.string,
  ifcGuidHandler: PropTypes.func,
};

LBDviewer.defaultProps = {
  projection: "ortho",
  ifcGuidHandler: (guid) => {
    console.log(guid);
  },
  onSelect: (selection) => {
    console.log("guid", selection.guid);
  },
};
