import { Url } from 'url';
import {
    User,
    Graph,
    Document
} from '.'

export interface Project {
    id: string,
    graphs: Graph[],
    documents: Document[],
    metadata: object,
}

export class ActiveProject implements Project {
    constructor(
        public id: string,
        public graphs: Graph[],
        public documents: Graph[],
        public metadata: object,
        public acl: Url,
        public selection: Selection[]
        ) {}
}

export interface Selection {
    method: "viewer" | "sparql"
    url: string,
    children: string[]
}

export interface Context {
    user: User | null,
    activeProject: ActiveProject | null,
    state: object,
    plugins: object
}