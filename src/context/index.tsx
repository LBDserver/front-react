import {createContext} from 'react'
import {
    User,
    ActiveProject,
    Context
} from '@interfaces'

const firstContext: Context = {
    user: null,
    activeProject: null,
    state: {},
    plugins: {}
}

const initialContext = {
    context: firstContext,
    setContext: (context: Context) => {}
}

const AppContext = createContext(initialContext)

export default AppContext
export { firstContext }

export type {
    User,
    ActiveProject,
    Context
}