import React, { useContext, useState, Fragment } from "react";
import AppContext from "@context";
import { TextField, Button } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import {setConfig} from '@util/functions'
import axios from 'axios'
import {translate, toSparql} from 'sparqlalgebrajs'
const initialQuery = `PREFIX props: <https://w3id.org/props#>
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
            const newQuery = await adaptQuery()
            const url = `${process.env.REACT_APP_BACKEND}/lbd/${context.currentProject.projectId}?query=${newQuery}`
            const results = await axios(setConfig(context, url))

            const selection = []
            results.data.results.results.bindings.forEach((binding) => {
                selection.push(binding.guid.value)
            })
            console.log('selection', selection)
            setContext({...context, querySelection: selection})
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
                context.activeGraphs.forEach(graph => {
                    splitQuery[0] = splitQuery[0] + `FROM <${graph}> `
                })
    
                let newQuery = splitQuery[0] + "WHERE" + splitQuery[1]
                resolve(encodeURIComponent(newQuery))
            } catch (error) {
                reject(error)
            }
        })
    }
  return (
    <Fragment>
      <TextField
        id="standard-multiline-flexible"
        label="SPARQL Query"
        multiline
        fullWidth
        rowsMax={10}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        variant="contained"
        color="secondary"
        startIcon={<SearchIcon fontSize="large" />}
        style={{
          bottom: 0,
          marginTop: "5%",
          left: "70%",
          width: '120px'
        }}
        onClick={e => executeQuery()}
      >
        Query
      </Button>
    </Fragment>
  );
}

export default QuerySparql;
