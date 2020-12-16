export interface Resource {
    url: string,
    id: string,
    metadata: Graph,
    acl: Graph,
    active: boolean
}

export interface Graph extends Resource {
    type: "graph"
    content?: Object //content as json-ld
}

export interface Document extends Resource {
    type: "document",
    content?: Object
}