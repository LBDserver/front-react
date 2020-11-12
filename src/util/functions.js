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

export {checkAuthentication, setConfig}