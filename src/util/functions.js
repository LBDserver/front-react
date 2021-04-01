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

function getGuid (gltfGuid) {
  var guidChars = [
    ["0", 10],
    ["A", 26],
    ["a", 26],
    ["_", 1],
    ["$", 1],
  ]
    .map(function (a) {
      var li = [];
      var st = a[0].charCodeAt(0);
      var en = st + a[1];
      for (var i = st; i < en; ++i) {
        li.push(i);
      }
      return String.fromCharCode.apply(null, li);
    })
    .join("");

  var b64 = function (v, len) {
    var r = !len || len == 4 ? [0, 6, 12, 18] : [0, 6];
    return r
      .map(function (i) {
        return guidChars.substr(parseInt(v / (1 << i)) % 64, 1);
      })
      .reverse()
      .join("");
  };

  var compressGuid = function (g) {
    g = g.replace(/-/g, "");
    var bs = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map(
      function (i) {
        return parseInt(g.substr(i, 2), 16);
      }
    );
    return (
      b64(bs[0], 2) +
      [1, 4, 7, 10, 13]
        .map(function (i) {
          return b64((bs[i] << 16) + (bs[i + 1] << 8) + bs[i + 2]);
        })
        .join("")
    );
  };

  let uncompressed = gltfGuid.split("-");
  let uncompressed_string = "";
  uncompressed.forEach((p, id) => {
    if (0 < id && id < uncompressed.length - 2) {
      uncompressed_string += p + "-";
    } else if (id === uncompressed.length - 2) {
      uncompressed_string += p;
    }
  });
  const id = compressGuid(uncompressed_string);
  return id;
};

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
  executeUpdate,
  getGuid
}