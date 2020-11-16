import { Register, Login, Project, ProjectSetup } from "./pages";

import { Navbar } from "@components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NonAuthRoute, AuthRoute } from "@util";
import AppContext, { initialState } from "@context";
import { useState } from "react";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "@util/theme";

const theme = createMuiTheme(themeFile);

function App() {
  const [context, setContext] = useState(initialState);

  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ context, setContext }}>
        <Router>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Project} />
            <AuthRoute exact path="/projectsetup" component={ProjectSetup} />
            <NonAuthRoute exact path="/register" component={Register} />
            <NonAuthRoute exact path="/login" component={Login} />
          </Switch>
        </Router>
      </AppContext.Provider>
    </MuiThemeProvider>
  );
}

export default App;
