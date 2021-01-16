import axios from 'axios'
import * as API from "lbd-server"
import * as AXIOS from 'axios'
import { translate, toSparql } from 'sparqlalgebrajs'

// //////////////////// PROJECT FUNCTIONS ////////////////////
// /**
//  * Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).
//  * @param username 
//  * @param email 
//  * @param password 
//  */
// async function register(username: string, email: string, password: string): Promise<API.IReturnUser> {
//   try {
//     const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/register`, {
//       username,
//       password,
//       email,
//     });

//     const data: API.IReturnUser = response.data
//     return data

//   } catch (error) {
//     error.message = `Unable to register; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Login as an existing user to the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
//  * @param email 
//  * @param password 
//  */
// async function login(email: string, password: string): Promise<API.IReturnUser> {
//   try {
//     const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/login`, {}, {
//       auth: {
//         username: email,
//         password,
//       }
//     });
//     const data: API.IReturnUser = response.data
//     return data
//   } catch (error) {
//     error.message = `Unable to login; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Log out on the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
//  * @param token 
//  */
// async function logout(token: string): Promise<void> {
//   try {
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       await axios.post(`${process.env.REACT_APP_BACKEND}/logout`, null, config);
//       return
//     } else {
//       throw new Error(`Token not found`)
//     }
//   } catch (error) {
//     error.message = `Unable to log out; ${error.message}`
//     throw error
//   }
// }

// // PROJECT ROUTES
// /**
//  * Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)
//  */
// async function getOpenProjects(): Promise<API.IReturnProject[]> {
//   try {
//     const response: AXIOS.AxiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd/public`)
//     const data: API.IReturnProject[] = response.data
//     return data
//   } catch (error) {
//     error.message = `Unable to fetch open projects; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Get all the projects associated with the currently authenticated user.
//  * @param token 
//  */
// async function getUserProjects(token: string): Promise<API.IReturnProject[]> {
//   try {
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       const response: AXIOS.AxiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd`, config)
//       const data: API.IReturnProject[] = response.data
//       return data
//     } else {
//       throw new Error(`Token not found`)
//     }

//   } catch (error) {
//     error.message = `Unable to fetch open projects; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Create a new project on the local LBDserver
//  * @param body 
//  * @param token 
//  */
// async function createProject(body: API.ICreateProject, token?: string): Promise<API.IReturnProject> {
//   try {
//     if (token) {
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         }
//       };
//       const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/lbd`, body, config);
//       const data: API.IReturnProject = response.data
//       return data
//     } else {
//       throw new Error(`Token not found`)
//     }

//   } catch (error) {
//     error.message = `Could not create new project; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Get a project by its URL or ID. If an ID is given, the URL is reconstructed via the backend URL defined in process.env.REACT_APP_BACKEND.
//  * @param project 
//  * @param token 
//  */
// async function getOneProject(project: string, token?: string): Promise<API.IReturnProject> {
//   try {
//     const url = modifyProjectUrl(project)
//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       response = await axios.get(url, config)
//     } else {
//       response = await axios.get(url)
//     }
//     const data: API.IReturnProject = response.data
//     console.log('data', data)
//     return data

//   } catch (error) {
//     error.message = `Unable to fetch open projects; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Delete a project by ID or URL. If an ID is provided; the URL is reconstructed based on the backend URL defined in process.env.REACT_APP_BACKEND.
//  * @param project 
//  * @param token 
//  */
// async function deleteProject(project: string, token?: string): Promise<void> {
//   try {
//     const url = modifyProjectUrl(project)
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       await axios.delete(url, config)
//     } else {
//       await axios.delete(url)
//     }
//     return
//   } catch (error) {
//     error.message = `Unable to delete project; ${error.message}`
//     throw error
//   }
// }

// ///////////////// RESOURCE FUNCTIONS //////////////////
// /**
//  * Delete a resource and its metadata graph.
//  * @param url 
//  * @param token 
//  */
// async function deleteResource(url: string, token?: string): Promise<void> {
//   try {
//     url = modifyUrl(url)
//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       response = await axios.delete(url, config)
//     } else {
//       response = await axios.delete(url)
//     }
//   } catch (error) {
//     error.message = `Unable to delete resource; ${error.message}`
//     throw error
//   }
// }

// ///////////////// DOCUMENT FUNCTIONS //////////////////
// interface IUploadResource {
//   label: string,
//   description: string,
//   file?: any
// }

// /**
//  * Upload a document to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual file to be uploaded. The "label" and "description" are used in the automatically created metadata file, which is equal to {fileurl}.meta.
//  * @param props 
//  * @param project 
//  * @param token 
//  */
// async function uploadDocument(props: IUploadResource, project: string, token?: string): Promise<API.IReturnMetadata> {
//   try {
//     const baseUrl = modifyProjectUrl(project)
//     const url = `${baseUrl}/files`

//     const bodyFormData = new FormData();
//     bodyFormData.append("resource", props.file);
//     bodyFormData.append("label", props.label);
//     bodyFormData.append("description", props.description);

//     const myHeaders = new Headers()
//     if (token) {
//       myHeaders.append("Authorization", `Bearer ${token}`)
//     }

//     const config: { [key: string]: any } = {
//       method: "POST",
//       redirect: "follow",
//       body: bodyFormData,
//       headers: myHeaders
//     };

//     const response: Response = await fetch(url, config)
//     const data: API.IReturnMetadata = await response.json()
//     return data

//   } catch (error) {
//     error.message = `Unable to upload document; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Get a (non RDF) document from the LBDserver by providing its URL. Authenticate with a token.
//  * @param uri 
//  * @param context 
//  */
// async function getDocument(url: string, token?: string): Promise<Buffer> {
//   try {
//     const fullUrl = new URL(url)
//     const realUrl = url.replace(`${fullUrl.protocol}//${fullUrl.host}`, `${process.env.REACT_APP_BACKEND}`)

//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       response = await axios.get(realUrl, config)
//     } else {
//       response = await axios.get(realUrl)
//     }
//     return response.data
//   } catch (error) {
//     error.message = `Unable to fetch document; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Get the metadata of a document resource on the lbdserver. The url of the document should be provided; either with .meta or without (if without; the ".meta" suffix is automatically added).
//  * @param uri 
//  * @param context 
//  */
// async function getDocumentMetadata(url: string, token?: string): Promise<API.IReturnMetadata> {
//   try {
//     if (!url.endsWith(".meta")) {
//       url = url.concat('.meta')
//     }
//     url = modifyUrl(url)

//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       response = await axios.get(url, config)
//     } else {
//       response = await axios.get(url)
//     }
//     console.log('response.data', response.data)
//     return response.data
//   } catch (error) {
//     error.message = `Unable to fetch document metadata; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Erase a document (and its corresponding metadata graph) from existence. 
//  * @param url 
//  * @param token 
//  */
// async function deleteDocument(url: string, token?: string): Promise<void> {
//   try {
//     await deleteResource(url, token)
//   } catch (error) {
//     error.message = `Unable to delete document; ${error.message}`
//     throw error
//   }
// }

// ////////////// GRAPH FUNCTIONS ///////////////
// /**
//  * Upload an RDF graph to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta.
//  * @param props 
//  * @param project 
//  * @param token 
//  */
// async function uploadGraph(props: IUploadResource, project: string, token: string): Promise<API.IReturnMetadata> {
//   try {
//     const baseUrl = modifyProjectUrl(project)
//     const url = `${baseUrl}/graphs`

//     const bodyFormData = new FormData();
//     if (props.file) {
//       bodyFormData.append("resource", props.file);
//     }
//     bodyFormData.append("label", props.label);
//     bodyFormData.append("description", props.description);

//     const myHeaders = new Headers()
//     if (token) {
//       myHeaders.append("Authorization", `Bearer ${token}`)
//     }
//     const config: { [key: string]: any } = {
//       method: "POST",
//       redirect: "follow",
//       body: bodyFormData,
//       headers: myHeaders
//     };

//     const response: Response = await fetch(url, config)
//     const data: API.IReturnMetadata = await response.json()
//     return data
//   } catch (error) {
//     error.message = `Unable to upload document`
//     throw error
//   }
// }

// /**
//  * Get a graph by its URI. You can also request metadata graphs explicitly in with this function. However, you may also use the function "getGraphMetadata" for this purpose.
//  * @param url 
//  * @param token 
//  */
// async function getGraph(url: string, token?: string): Promise<API.IReturnGraph> {
//   try {
//     const fullUrl = new URL(url)
//     const realUrl = url.replace(`${fullUrl.protocol}//${fullUrl.host}`, `${process.env.REACT_APP_BACKEND}`)

//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       response = await axios.get(realUrl, config)
//     } else {
//       response = await axios.get(realUrl)
//     }
//     return response.data
//   } catch (error) {
//     error.message = `Unable to fetch document; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Get the metadata graph of a given graph. You may either provide the ".meta" suffix or skip it. 
//  * @param url 
//  * @param token 
//  */
// async function getGraphMetadata(url: string, token?: string): Promise<API.IReturnMetadata> {
//   try {
//     if (!url.endsWith(".meta")) {
//       url = url.concat('.meta')
//     }
//     url = modifyUrl(url)
//     const data: API.IReturnMetadata = await getGraph(url, token)
//     return data
//   } catch (error) {
//     error.message = `Error finding metdata graph; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Erase a project graph and its corresponding metadata graph from existence.
//  * @param url 
//  * @param token 
//  */
// async function deleteGraph(url: string, token?: string): Promise<void> {
//   try {
//     await deleteResource(url, token)
//   } catch (error) {
//     error.message = `Unable to delete graph; ${error.message}`
//     throw error
//   }
// }

// ///////////////// QUERY FUNCTIONS ////////////////
// /**
//  * Query a project with SPARQL SELECT.
//  * @param project 
//  * @param query 
//  * @param token 
//  */
// async function queryProjectSelect(project: string, query: string, token?: string): Promise<API.IQueryResults> {
//   try {
//     let url = modifyProjectUrl(project)
//     url = url + "?query=" + query.toString()
//     console.log('url', url)
//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       response = await axios.get(url, config)
//     } else {
//       response = await axios.get(url)
//     }
//     const data: API.IQueryResults = response.data.results
//     return data

//   } catch (error) {
//     error.message = `Unable to query project; ${error.message}`
//     throw error
//   }
// }

// interface rdfNode {
//   termType: string,
//   value: string
// }

// ///////////////// QUERY FUNCTIONS ////////////////
// /**
//  * Query multiple graphs with SPARQL SELECT.
//  * @param project 
//  * @param query 
//  * @param graphs
//  * @param token 
//  */
// async function queryMultiple(project: string, query: string, graphs: string[], token?: string): Promise<API.IQueryResults> {
//   try {

//     const algebra = translate(query, { quads: true })
//     const rdfGraphs: rdfNode[]  = []
//     graphs.forEach((graph: string) => {
//       rdfGraphs.push({ termType: "NamedNode", value: graph })
//     })

//     const newAlgebra = {
//       input: algebra,
//       default: rdfGraphs,
//       type: "from",
//       named: []
//     }
//     query = toSparql(newAlgebra)
//     console.log('query', query)

//     let url = modifyProjectUrl(project)
//     url = url + "?query=" + encodeURIComponent(query.toString())
//     console.log('url', url)
//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       response = await axios.get(url, config)
//     } else {
//       response = await axios.get(url)
//     }
//     const data: API.IQueryResults = response.data.results
//     return data

//   } catch (error) {
//     error.message = `Unable to query project; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Query a graph with SPARQL SELECT.
//  * @param project 
//  * @param query 
//  * @param token 
//  */
// async function queryGraphSelect(url: string, query: string, token?: string): Promise<API.IQueryResults> {
//   try {
//     url = modifyUrl(url)
//     url = url + "?query=" + query.toString()
//     console.log('url', url)
//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       response = await axios.get(url, config)
//     } else {
//       response = await axios.get(url)
//     }
//     const data: API.IQueryResults = response.data.results
//     return data

//   } catch (error) {
//     error.message = `Unable to query graph; ${error.message}`
//     throw error
//   }
// }

// async function updateProject(project: string, query: string, token?: string): Promise<void> {
//   try {
//     let url = modifyProjectUrl(project)
//     url = url + "?update=" + encodeURIComponent(query.toString())
//     console.log(url)
//     let response: AXIOS.AxiosResponse
//     if (token) {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };
//       response = await axios.put(url, config)
//     } else {
//       response = await axios.put(url)
//     }
//     return

//   } catch (error) {
//     error.message = `Unable to update; ${error.message}`
//     throw error
//   }
// }

// /**
//  * Update a named graph in the project (SPARQL INSERT/DELETE). Be careful. 
//  * @param url 
//  * @param query 
//  * @param token 
//  */
// async function updateGraph(url: string, query: string, token?: string): Promise<void> {
//   try {
//     console.log('url', url)
//     // get project id from url
//     const urlProps = new URL(url)
//     const project = urlProps.pathname.split("/")[2]

//     // change query
//     const algebra = translate(query, { quads: true })
//     console.log('algebra', algebra)
//     for (const key of Object.keys(algebra)) {
//       switch (key) {
//         case 'delete':
//           algebra[key].forEach((quad: any) => {
//             quad.graph = { termType: "NamedNode", value: url }
//           });
//           break;
//         case "insert":
//           algebra[key].forEach((quad: any) => {
//             quad.graph = { termType: "NamedNode", value: url }
//           });
//           break;
//         default:
//           break;
//       }
//     }
//     query = toSparql(algebra)
//     // update project
//     await updateProject(project, query, token)
//     return
//   } catch (error) {
//     error.message = `Unable to update graph; ${error.message}`
//     throw error
//   }
// }

// ///////////////// HELPER FUNCTIONS ///////////////
// /**
//  * Makes sure an url is present. If an url is already given to the function, the base of the url gets modified (for localhost usage). If not, the project url is reconstructed using the backend url (provided in the process.env.REACT_APP_BACKEND) and the project id.
//  * @param id 
//  */
// function modifyProjectUrl(id: string): string {
//   let url: string
//   try {
//     url = modifyUrl(id)
//   } catch (error) {
//     url = `${process.env.REACT_APP_BACKEND}/lbd/${id}`
//   }
//   return url
// }

// /**
//  * Modifies the url to the backend, if the backend is running locally. Therefore, the process.env.REACT_APP_BACKEND should be defined.
//  * @param url 
//  */
// function modifyUrl(url: string) {
//   try {
//     const fullUrl = new URL(url)
//     url = url.replace(`${fullUrl.protocol}//${fullUrl.host}`, `${process.env.REACT_APP_BACKEND}`)
//     return url
//   } catch (error) {
//     error.message = `Unable to modify URL; ${error.message}`
//     throw error
//   }
// }

// export {
//   getOpenProjects,
//   logout,
//   register,
//   login,
//   getUserProjects,
//   createProject,
//   uploadDocument,
//   uploadGraph,
//   getDocument,
//   getOneProject,
//   getDocumentMetadata,
//   deleteProject,
//   deleteDocument,
//   getGraphMetadata,
//   deleteResource,
//   deleteGraph,
//   queryProjectSelect,
//   queryGraphSelect,
//   updateGraph,
//   queryMultiple
// }