import {Register, Login} from "./pages";

import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { NonAuthRoute, AuthRoute } from "@util";
import AppContext, {initialState} from "./context/appContext";
import {useState} from 'react'

function App() {
  const [context, setContext] = useState(initialState)

  return (
    <div className="App">
    <AppContext.Provider value={{context, setContext}}>
        <Router>
          <Navbar />
            <Switch>
              <NonAuthRoute exact path="/register" component={Register} />
              <NonAuthRoute exact path="/login" component={Login} />
            </Switch>
        </Router>
      </AppContext.Provider>
    </div>
  );
}

export default App;
