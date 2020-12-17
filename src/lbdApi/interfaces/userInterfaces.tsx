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
    acl: Url
}

export interface Credentials {
    username: string,
    password: string
}