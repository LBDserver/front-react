import { Graph } from "interfaces";
import { Url } from "url";

export interface User {
    email: string,
    token: string,
    webid: Url,
    projects: string[]
}

export interface ProjectMeta {
    id: string,
    url: Url,
    acl: Graph
}

export interface Credentials {
    username: string,
    password: string
}