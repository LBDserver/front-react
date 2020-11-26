function checkAuthentication (context) {
    if (context.user && context.token) {
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

  if (context.token && context.user) {
    config.headers = { 
      'Authorization': `Bearer ${context.token}`
    }
  }
  return config
}

async function queryComunica(query, sources, engine) {
  try {


    const result = await engine.query(query, {sources})
    const bindings = await result.bindings
    console.log('bindings', bindings)
    return bindings
  } catch (error) {
    console.log(error)
    return error
  }
}

export {checkAuthentication, setConfig, queryComunica}