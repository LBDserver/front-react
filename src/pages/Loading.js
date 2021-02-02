import React, { useContext, useEffect, useState } from "react";
import useStyles from "@styles";
import { CircularProgress } from "@material-ui/core";
import {Redirect} from 'react-router-dom'
import AppContext from "@context";

function Loading() {
  const { context, setContext } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const classes = useStyles()

  useEffect(() => {
    async function processSession() {
      const authCode = new URL(window.location.href).searchParams.get("code");
      if (authCode) {
        await context.user.handleIncomingRedirect(window.location.href);
        await setContext({ ...context, user: context.user });
      }
      setLoading(false);
    }
    processSession();
  }, [context, setContext]);

  return (
    <div style={{ position: "fixed", top: "40%", left: "50%"}}>
      {loading ? (
        <CircularProgress size={100} className={classes.progress} />
      ) : (
        <Redirect to="/project" />
      )}
    </div>
  );
}

export default Loading;
