import {IReturnProject, IReturnUser} from "lbd-server"
import {Session} from '@inrupt/solid-client-authn-browser'

interface CurrentProject extends IReturnProject {
    activeGraphs: string[],
    activeDocuments: string[]
}

interface IContext {
    user: IReturnUser | ISolidUser | null,
    currentProject: CurrentProject | null,
    states: IObject[],
    plugin: string | null,
    selection: ISelection[]
}

interface ISolidUser {
    session: Session
}

interface IObject {
    [x: string]: any
}

interface ISelection {
    guid: string,
    [x: string]: any
}

export {
    IContext
}