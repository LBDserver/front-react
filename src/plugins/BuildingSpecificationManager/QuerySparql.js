import React, { useContext, useState, Fragment } from "react";
import AppContext from "@context";
import { TextField, Button, Grid } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { translate, toSparql } from "sparqlalgebrajs";
import {
  queryMultiple,
  queryGraphSelect,
  updateGraph,
  getGraph,
} from "lbd-server";

const articleQuery = `PREFIX dc: <http://purl.org/dc/elements/1.1/>
select ?s ?p ?o 

where { 
	?s dc:description ?o .
    
}`;

function QuerySparql() {
  const { context, setContext } = useContext(AppContext);
  const [query, setQuery] = useState(articleQuery);
  //const [searchResult, setSearchResult] = useState();

  async function executeSearchQuery() {
    console.log(context.currentProject.activeGraphs);
    try {
      let token;
      if (context.user && context.user.token) {
        token = context.user.token;
      }
      const results = await queryMultiple(
        context.currentProject.id,
        articleQuery,
        context.currentProject.activeGraphs,
        token
      );

      console.log(results.results.bindings);
      //setSearchResult(results.results.bindings);
    } catch (error) {
      console.log("error", error);
    }
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
          value={articleQuery}
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
            width: "120px",
          }}
          onClick={(e) => executeSearchQuery()}
        >
          Query
        </Button>
      </Grid>
    </Grid>
  );
}

export default QuerySparql;
