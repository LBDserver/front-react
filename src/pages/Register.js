import React, { useState, useContext } from "react";
import {
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "@styles";
import AppContext from "@context";
import { Link } from "react-router-dom";
import useStyles from "@styles";
import { checkAuthentication } from "@util/functions";
import {Redirect} from 'react-router-dom'
import {register} from "lbd-server"

function Register(props) {
  const { context, setContext } = useContext(AppContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const classes = useStyles();


  async function submitRegistration(event) {
    event.preventDefault();
    try {
      if (password !== confirmPassword) {
        setErrors({ ...errors, passwordError: "Passwords do not match" });
        return;
      }
      setLoading(true);

      const details = await register(username, email, password);

      setLoading(false);
      setContext({ ...context, user: details});
    } catch (error) {
      console.log('error', error.response.data.message)
      try {
        const keyValue = error.response.data.reason.keyValue
        
        if (keyValue.hasOwnProperty("email")) {
          setErrors({
            ...errors,
            emailError: "An account with this email adress already exists",
          });
        } else if (keyValue.hasOwnProperty("username")) {
          setErrors({
            ...errors,
            usernameError: "An account with this username already exists",
          });
        }
      } catch (error) {
        console.log("error", error);
      }
      setLoading(false);
    }
  }

  return (
    <div>
      {!checkAuthentication(context) ? (
        <div>
          <Grid container className={classes.form}>
            <Grid item sm />
            <Grid item sm>
              <Typography variant="h2" className={classes.pageTitle}>
                Register
              </Typography>
              <form onSubmit={(e) => submitRegistration(e)}>
                <TextField
                  id="username"
                  name="username"
                  type="text"
                  label="Username"
                  helperText={errors.usernameError}
                  error={errors.usernameError ? true : false}
                  className={classes.textField}
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrors({ ...errors, usernameError: null });
                  }}
                  fullWidth
                />
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  helperText={errors.emailError}
                  error={errors.emailError ? true : false}
                  className={classes.textField}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, emailError: null });
                  }}
                  fullWidth
                />
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  helperText={errors.passwordError}
                  error={errors.passwordError ? true : false}
                  className={classes.textField}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, passwordError: null });
                  }}
                  fullWidth
                />
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  helperText={errors.passwordError}
                  error={errors.passwordError ? true : false}
                  className={classes.textField}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors({ ...errors, passwordError: null });
                  }}
                  fullWidth
                />
                <Button
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Register
                  {loading && (
                    <CircularProgress size={20} className={classes.progress} />
                  )}{" "}
                </Button>
                <br />
                <p styles={{ padding: "20px" }}>
                  Already have an account? Log in <Link to="/login">here</Link>
                </p>
              </form>
            </Grid>
            <Grid item sm />
          </Grid>
        </div>
      ) : (
        <div>
          <Redirect to="/" />
        </div>
      )}
    </div>
  );
}

export default Register;
