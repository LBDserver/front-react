import { Register, Login, Project, ProjectSetup, Home } from "./pages";

import { Navbar } from "@components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NonAuthRoute, AuthRoute } from "@util";
import AppContext, { initialState } from "@context";
import { useState, useEffect } from "react";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "@util/theme";
import axios from 'axios'
import GeometryComponent from './components/GeometryComponent/GeometryComponentRhinoGLTF'

import {newEngine} from '@comunica/actor-init-sparql';

const theme = createMuiTheme(themeFile);

function App() {
  const [context, setContext] = useState(initialState);

  useEffect(() => {
    try {
      const myEngine = newEngine();
      setContext({...context, comunica: myEngine})   
    } catch (error) {
      console.log('error', error)
    }
  }, [])


  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ context, setContext }}>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/project" component={Project} />
            <AuthRoute exact path="/projectsetup" component={ProjectSetup} />
            <NonAuthRoute exact path="/register" component={Register} />
            <NonAuthRoute exact path="/login" component={Login} />
          </Switch>
        </Router>
      </AppContext.Provider>
    </MuiThemeProvider>
  );
}




// function App() {
//   const model1= 'https://jwerbrouck.inrupt.net/public/myProjects/gravensteen/model.txt'
//   const model2 = 'https://raw.githubusercontent.com/LBDserver/resources/main/duplex/duplex.gltf'
//   return (
//     <div>
//       <GeometryComponent
//         height="96%"
//         width="86%"
//         models={[model2]}
//         projection="perspective"
//         selectionHandler={(data) => { return }}
//         queryResults={[]}
//       />
//     </div>
//   );
// }

export default App;
