import * as API from "lbd-api"

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
    state: object,
    plugins: object
}

export {
    IContext
}