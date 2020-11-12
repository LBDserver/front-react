import {createContext} from 'react'

export const initialState = {
 user: undefined,
 activeGraphs: [],
 activeDocuments: [],
 selection: []
}

const AppContext = createContext()

export default AppContext