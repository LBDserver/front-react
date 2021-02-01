import { Register, Login, Project, ProjectSetup, Home } from "./pages";

import { Navbar } from "@components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { NonAuthRoute, AuthRoute } from "@util";
import AppContext, { initialState } from "@context";
import { useState, useEffect } from "react";

import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "@util/theme";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "react-query";
import { newEngine } from "@comunica/actor-init-sparql";
import {Snackbar} from '@material-ui/core'
import MuiAlert from "@material-ui/lab/Alert";
import {processSession} from "lbd-server"

const theme = createMuiTheme(themeFile); 
const queryClient = new QueryClient();

function App() {
  const [context, setContext] = useState(initialState);

  useEffect(() => {
      async function process() {
        try {
          const session = await processSession(context.user)
          setContext({...context, user: session})
        } catch (error) {
          console.log('error.message', error.message)
          setContext({...context, error})
        }
      }
      process()
  }, [context.user]);




  function handleErrorClose (event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setContext({...context, error: null})
  };

  return (
    <MuiThemeProvider theme={theme}>
      <AppContext.Provider value={{ context, setContext }}>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/project" component={Project} />
              <AuthRoute exact path="/projectsetup" component={ProjectSetup} />
              {/* <NonAuthRoute exact path="/register" component={Register} /> */}
              {/* <NonAuthRoute exact path="/login" component={Login} /> */}
            </Switch>
              {context.error ? (
                <Snackbar
                  open={context.error}
                  autoHideDuration={6000}
                  onClose={handleErrorClose}
                >
                  <Alert onClose={handleErrorClose} severity="error">
                    {context.error.message}
                  </Alert>
                </Snackbar>
              ) : (
                <></>
              )}
          </Router>
        </QueryClientProvider>
      </AppContext.Provider>
    </MuiThemeProvider>
  );
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}


export default App;
