import {Session} from '@inrupt/solid-client-authn-browser'
import {createContext} from 'react'
import {IContext} from "../interfaces/contextInterface"

export const initialState: IContext = {
 user: new Session(),
 currentProject: null,
 states: [{"project": {}}],
 plugin: "project",
 selection: [],
 error: null
}

const initialContext = {
    context: initialState,
    setContext: (context: IContext) => {}
}

const AppContext = createContext(initialContext)

export default AppContext