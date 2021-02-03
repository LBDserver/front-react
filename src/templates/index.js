const namedGraphMeta = (namedGraph, label, description) => {
    let data =  `@prefix acl: <http://www.w3.org/ns/auth/acl#>. 
    @prefix lbd: <https://lbdserver.org/vocabulary#>. 
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>. 
    @prefix vcard: <http://www.w3.org/2006/vcard/ns#>.

    @prefix : <./>. 
    <${namedGraph}> rdfs:comment "${description}";
        rdfs:label "${label}".
    `

    data = data.replace(/\n/g, "")
    return data
}

const documentMeta = (documentUrl, description, file) => {
    const name = file.name
    let extension = name.split(".")[name.split(".").length -1]

    let data =  `@prefix acl: <http://www.w3.org/ns/auth/acl#>. 
    @prefix lbd: <https://lbdserver.org/vocabulary#>. 
    @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>. 
    @prefix vcard: <http://www.w3.org/2006/vcard/ns#>.

    @prefix : <./>. 
    <${documentUrl}> rdfs:comment "${description}";
        rdfs:label "${name}".
    `

    data = data.replace(/\n/g, "")
    return data
}

export {
 namedGraphMeta,
 documentMeta
}