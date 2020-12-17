import { Url } from "url";

export interface Resource {
    url: Url,
    id: string,
    metadata: object,
    acl?: Url,
    active: boolean,
    content?: object //content as json-ld
}

export class Graph implements Resource {
    constructor(
        public url: Url,
        public id: string,
        public metadata: object,
        public acl: Url,
        public active = false,
        public type="graph") {}
}

export class Document implements Resource {
    constructor(
        public url: Url,
        public id: string,
        public metadata: object,
        public acl: Url,
        public active = false,
        public type="document") {}
}