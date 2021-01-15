import {IReturnProject, IReturnUser} from "lbd-server"

interface CurrentProject extends IReturnProject {
    activeGraphs: string[],
    activeDocuments: string[]
}

interface IContext {
    user: IReturnUser | null,
    currentProject: CurrentProject | null,
    states: IPluginState[],
    plugin: string | null,
    selection: string | null,
    querySelection: string[] | null
}

interface IPluginState {
    [x: string]: any
}

export {
    IContext
}