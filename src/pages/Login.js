import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@material-ui/core";
import useStyles from "@styles";
import AppContext from '@context'
import {Link} from 'react-router-dom'
import {login} from "lbd-solid"

function Login(props: any) {
  const classes = useStyles()
  const {context, setContext} = useContext(AppContext)
  const [password, setPassword] = useState("test123");
  const [email, setEmail] = useState("jeroen.werbrouck@hotmail.com");
  const [loginError, setLoginError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);

  useEffect(() => {
    async function processSession() {
      setLoadingSession(true)
      const authCode = new URL(window.location.href).searchParams.get("code");
      if (authCode) {
        await context.user.handleIncomingRedirect(window.location.href)
        setContext({...context})
      }
    }
    processSession()
    setLoadingSession(false)
  }, [context, setContext]);


  async function submitLogin(e) {
      e.preventDefault()
      try {
        setLoading(true);
        const details = await login(email, password)
        setLoading(false);        
        setContext({...context, user: details})      
      } catch (error) {
        setLoading(false);
        setLoginError("Could not log in with these credentials")
      }
  }

  async function loginOIDC(e) {
    e.preventDefault()
    await context.user.login({
      oidcIssuer: 'https://broker.pod.inrupt.com',
      redirectUrl: "http://localhost:3001/login",
    });
  }

  return (
    <div>
      {(loadingSession) ? (<CircularProgress size={20} className={classes.progress} />) : (
      <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm>
        <Typography variant="h2" className={classes.pageTitle}>
          Log in
        </Typography>
        <form onSubmit={e => submitLogin(e)}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            helperText={loginError}
            error={loginError ? true : false}
            className={classes.textField}
            value={email}
            onChange={(e) => {setEmail(e.target.value); setLoginError(null)}}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            helperText={loginError}
            error={loginError ? true : false}
            className={classes.textField}
            value={password}
            onChange={(e) => {setPassword(e.target.value); setLoginError(null)}}
            fullWidth
          />
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
            className={classes.button}
          >
            Log in{" "}
            {loading && (
              <CircularProgress size={20} className={classes.progress} />
            )}{" "}
          </Button>
          <br />
          <p styles={{ padding: "20px" }}>
            Don't have an account yet? Create one <Link to="/register">here</Link> or login <Button onClick={loginOIDC}>using OIDC</Button>.
          </p>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
      )}
    </div>
  );
}

export default Login;
