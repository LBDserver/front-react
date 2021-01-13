import axios from 'axios'
import * as API from "lbd-api"
import * as AXIOS from 'axios'
import { IContext } from '../interfaces/contextInterface'

// USER ROUTES
async function register(username: string, email: string, password: string): Promise<API.IReturnUser> {
  const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/register`, {
    username,
    password,
    email,
  });

  const data: API.IReturnUser = response.data
  return data
}

async function login(email: string, password: string): Promise<API.IReturnUser> {
  try {
    const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/login`, {}, {
      auth: {
        username: email,
        password,
      }
    });
    const data: API.IReturnUser = response.data
    return data
  } catch (error) {
    console.log('error', error)
    throw new Error(`Unable to login; ${error.message}`)
  }
}

async function logout(context: IContext): Promise<void> {
  try {
    if (context.user) {
      const config = {
        headers: {
          Authorization: `Bearer ${context.user.token}`,
        },
      };
      await axios.post(`${process.env.REACT_APP_BACKEND}/logout`, null, config);
      return
    } else {
      throw new Error(`User not found`)
    }
  } catch (error) {
    console.log('error', error)
    throw new Error(`Unable to log out; ${error.message}`)
  }
}

// PROJECT ROUTES
async function getOpenProjects(): Promise<API.IReturnProject[]> {
  try {
    const response: AXIOS.AxiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd/public`)
    const data: API.IReturnProject[] = response.data
    return data
  } catch (error) {
    console.log('error', error)
    throw new Error(`Unable to fetch open projects; ${error.message}`)
  }
}

async function getUserProjects(context: IContext): Promise<API.IReturnProject[]> {
  try {
    if (context.user) {
      const config = {
        headers: {
          Authorization: `Bearer ${context.user.token}`,
        },
      };
      const response: AXIOS.AxiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd`, config)
      const data: API.IReturnProject[] = response.data
      return data
    } else {
      throw new Error(`User not found`)
    }

  } catch (error) {
    console.log('error', error)
    throw new Error(`Unable to fetch open projects; ${error.message}`)
  }
}

async function createProject(body: API.ICreateProject, context: IContext): Promise<API.IReturnProject> {
  try {
    if (context.user) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.user.token}`,
        }
      };
      const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/lbd`, body, config);
      const data: API.IReturnProject = response.data
      return data
    } else {
      throw new Error(`User not found`)
    }

  } catch (error) {
    throw new Error(`Could not create new project; ${error.message}`)
  }
}

async function getProject(id: string, context: IContext): Promise<API.IReturnProject> {
  try {
    let response: AXIOS.AxiosResponse
    if (context.user) {
      const config = {
        headers: {
          Authorization: `Bearer ${context.user.token}`,
        },
      };
      response = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd/${id}`, config)
    } else {
      response = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd/${id}`)
    }
    const data: API.IReturnProject = response.data
    return data

  } catch (error) {
    console.log('error', error)
    throw new Error(`Unable to fetch open projects; ${error.message}`)
  }
}

interface IUploadResource {
  label: string,
  description: string,
  file?: any
}

async function uploadDocument(props: IUploadResource, context: IContext): Promise<API.IReturnResource> {
  try {
    const bodyFormData = new FormData();
    bodyFormData.append("resource", props.file);
    bodyFormData.append("label", props.label);
    bodyFormData.append("description", props.description);

    const myHeaders = new Headers()
    if (context.user) {
      myHeaders.append("Authorization", `Bearer ${context.user.token}`)
    }
    if (context.currentProject) {
      const url = `${process.env.REACT_APP_BACKEND}/lbd/${context.currentProject.id}/files`
      const config: { [key: string]: any } = {
        method: "POST",
        redirect: "follow",
        body: bodyFormData,
        headers: myHeaders
      };

      const response: Response = await fetch(url, config)
      const data: API.IReturnResource = await response.json()
      return data
    } else {
      throw new Error(`No current project is selected`)
    }
  } catch (error) {
    console.log('error', error)
    throw new Error(`Unable to upload document`)
  }
}

async function uploadGraph(props: IUploadResource, context: IContext): Promise<API.IReturnResource> {
  try {
    const bodyFormData = new FormData();
    if (props.file) {
      bodyFormData.append("resource", props.file);
    }
    bodyFormData.append("label", props.label);
    bodyFormData.append("description", props.description);

    const myHeaders = new Headers()
    if (context.user) {
      myHeaders.append("Authorization", `Bearer ${context.user.token}`)
    }
    if (context.currentProject) {
      const url = `${process.env.REACT_APP_BACKEND}/lbd/${context.currentProject.id}/graphs`
      const config: { [key: string]: any } = {
        method: "POST",
        redirect: "follow",
        body: bodyFormData,
        headers: myHeaders
      };

      const response: Response = await fetch(url, config)
      const data: API.IReturnResource = await response.json()
      return data
    } else {
      throw new Error(`No current project is selected`)
    }
  } catch (error) {
    console.log('error', error)
    throw new Error(`Unable to upload document`)
  }
}

export {
  getOpenProjects,
  logout,
  register,
  login,
  getUserProjects,
  createProject,
  uploadDocument,
  uploadGraph
}