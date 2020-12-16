import { Project } from '@interfaces'
import axios from 'axios'
const {parse} = require('@frogcat/ttl2jsonld')

// returns the projects with public accessibility stored locally in the server
function getOpenProjects() {
    return new Promise<Project[]>(async (resolve, reject) => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd/public`)
            data.projects.forEach((project: Project) => {
                project["metadata"] = parse(project.metadata)
            })
            resolve(data.projects)
        } catch (error) {
            reject(error)
        }
    })
}

export {
    getOpenProjects
}