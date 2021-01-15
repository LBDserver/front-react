import React, { useContext, useState, Fragment } from "react";
import AppContext from "@context";
import { TextField, Button, Grid } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {translate, toSparql} from 'sparqlalgebrajs'
import {queryMultiple} from 'lbd-server'

const initialQuery = `PREFIX props: <https://w3id.org/props#>
PREFIX bot: <https://w3id.org/bot#>
PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
PREFIX schema: <http://schema.org/>
PREFIX omg: <https://w3id.org/omg#>
PREFIX fog: <https://w3id.org/fog#>
SELECT ?s ?guid
WHERE {
    ?s a beo:Door; 
        # omg:hasGeometry/fog:hasGltfId ?guid .
        props:globalIdIfcRoot/schema:value ?guid .
}`;

const initialQueryIfc = `PREFIX props: <https://w3id.org/props#>
PREFIX bot: <https://w3id.org/bot#>
PREFIX beo: <https://pi.pauwel.be/voc/buildingelement#>
PREFIX schema: <http://schema.org/>
SELECT ?s ?guid
WHERE {
    ?s a beo:Window; 
        props:globalIdIfcRoot/schema:value ?guid .
}`;

function QuerySparql() {
  const { context, setContext } = useContext(AppContext);
  const [query, setQuery] = useState(initialQuery);

    async function executeQuery () {
        try {
          let token
          if (context.user && context.user.token) {
            token = context.user.token
          }
            const results = await queryMultiple(context.currentProject.id, query, context.currentProject.activeGraphs, token)

            const selection = []
            results.results.bindings.forEach((binding) => {
                selection.push({guid: binding.guid.value})
            })
            setContext({...context, selection})
        } catch (error) {
            console.log('error', error)
        }
    }

    function adaptQuery(){
        return new Promise((resolve, reject) => {
            try {
                let splitQuery = query.split('where')
                if (splitQuery.length <= 1) {
                    splitQuery = query.split('WHERE')
                }
                context.currentProject.activeGraphs.forEach(graph => {
                    splitQuery[0] = splitQuery[0] + `FROM <${graph}> `
                })
    
                let newQuery = splitQuery[0] + "WHERE" + splitQuery[1]
                resolve((newQuery))
            } catch (error) {
                reject(error)
            }
        })
    }
  return (
    <Grid>
      <Grid item>
      <TextField
        id="standard-multiline-flexible"
        label="SPARQL Query"
        multiline
        fullWidth
        rowsMax={30}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      </Grid>
      <Grid item>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<SearchIcon fontSize="large" />}
        style={{
          bottom: 0,
          marginTop: 15,
          width: '120px'
        }}
        onClick={e => executeQuery()}
      >
        Query
      </Button>
      </Grid>

    </Grid>
  );
}

export default QuerySparql;
