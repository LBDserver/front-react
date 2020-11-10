import {createContext} from 'react'

export const initialState = {
 user: undefined,
 activeGraphs: [],
 activeDocuments: []
}

const AppContext = createContext()

export default AppContext