import {createContext} from 'react'
import {IContext} from "../interfaces/contextInterface"

export const initialState: IContext = {
 user: null,
 currentProject: null,
 states: [{"project": {}}],
 plugin: "project",
 selection: null,
 querySelection: null
}

const initialContext = {
    context: initialState,
    setContext: (context: IContext) => {}
}

const AppContext = createContext(initialContext)

export default AppContext