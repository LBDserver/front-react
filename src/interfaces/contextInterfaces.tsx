import {
    User,
    Graph,
    Document
} from './'

export interface Project {
    id: string,
    graphs: Graph[],
    documents: Document[],
    metadata: Metadata,
}

interface Metadata {
    "rdfs:comment": string,
    "rdfs:label": string,
    "lbd:hasAcl": string
}

export interface ActiveProject extends Project {
    acl: Graph,
    selection: Selection[]
}

export interface Selection {
    method: "viewer" | "sparql"
    url: string,
    children: string[]
}

export interface Context {
    user: User | null,
    activeProject: ActiveProject | null,
    state: Object
    plugins: Object
}