import * as API from "lbd-server"

interface ISelection {
    method: "viewer" | "sparql"
    url: string,
    children: string[]
}

interface CurrentProject extends API.IReturnProject {
    activeGraphs: string[],
    activeDocuments: string[],
    selection?: ISelection[]
}

interface IContext {
    user: API.IReturnUser | null,
    currentProject: CurrentProject | null,
    states: IPluginState[],
    plugin: string,
    selection?: string,
    querySelection?: string[]
}

interface IPluginState {
    [x: string]: any
}

export {
    IContext
}