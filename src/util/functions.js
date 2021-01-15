import axios from 'axios'
import url from 'url'

function checkAuthentication(context) {
  if (context.user && context.user.token) {
    return true
  } else {
    return false
  }
}

const setConfig = (context, url) => {
  const config = {
    method: 'get',
    url
  };

  if (context.user.token && context.user) {
    config.headers = {
      'Authorization': `Bearer ${context.user.token}`
    }
  }
  return config
}

async function queryComunica(query, sources, engine) {
  try {


    const result = await engine.query(query, { sources })
    const bindings = await result.bindings
    console.log('bindings', bindings)
    return bindings
  } catch (error) {
    console.log(error)
    return error
  }
}

async function executeUpdate(query, context, graph) {
  return new Promise(async (resolve, reject) => {
    try {

      const fullUrl = url.parse(graph)
      const realGraphUrl = graph.replace(`${fullUrl.protocol}//${fullUrl.host}`, process.env.REACT_APP_BACKEND) + `?update=${encodeURIComponent(query)}`

      const config = {
        method: 'post',
        url: realGraphUrl
      };

      if (context.user.token && context.user) {
        config.headers = {
          'Authorization': `Bearer ${context.user.token}`
        }
      }

      const results = await axios(config)
      resolve(results)
    } catch (error) {
      console.log('error', error)
      reject(error)
    }
  })
}

function executeQuery(query, context) {
  return new Promise(async (resolve, reject) => {
    try {
      const newQuery = await adaptQuery(query, context.currentProject.activeGraphs)
      const url = `${process.env.REACT_APP_BACKEND}/lbd/${context.currentProject.id}?query=${newQuery}`
      const results = await axios(setConfig(context, url))
      const selection = []
      results.data.results.results.bindings.forEach((binding) => {
        selection.push(binding)
      })

      resolve(selection)

    } catch (error) {
      console.log('query', query)
      reject(error)
    }
  })
}

function adaptQuery(query, graphs) {
  return new Promise((resolve, reject) => {
    try {
      let splitQuery = query.split('where')
      if (splitQuery.length <= 1) {
        splitQuery = query.split('WHERE')
      }

      graphs.forEach(graph => {
        splitQuery[0] = splitQuery[0] + `FROM <${graph}> `
      })

      let newQuery = splitQuery[0] + "WHERE" + splitQuery[1]
      resolve(encodeURIComponent(newQuery))
    } catch (error) {
      reject(error)
    }
  })
}

export {
  checkAuthentication,
  setConfig,
  queryComunica,
  executeQuery,
  adaptQuery,
  executeUpdate
}