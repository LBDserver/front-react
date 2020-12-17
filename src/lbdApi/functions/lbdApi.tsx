import { Project } from 'lbdApi/interfaces'
import axios from 'axios'
const {parse} = require('@frogcat/ttl2jsonld')

function createProject() {
    return new Promise<Project>(async (resolve, reject) => {
        try {
            
        } catch (error) {
            reject(error)
        }
    })
}

function getAllProjects() {
    return new Promise<Project[]>(async (resolve, reject) => {
        try {
            
        } catch (error) {
            reject(error)
        }
    })
}

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

function getProject() {
    return new Promise<Project>(async (resolve, reject) => {
        try {
            
        } catch (error) {
            reject(error)
        }
    })
}

function deleteProject() {
    return new Promise<void>(async (resolve, reject) => {
        try {
            resolve()
        } catch (error) {
            reject(error)
        }
    })
}

function queryProject() {
    
}

export {
    getOpenProjects
}