import React, { useState } from "react";
import {
  Grid,
  Link,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import styles from "../styles";

function Login(props) {
  const [password, setPassword] = useState("test123");
  const [email, setEmail] = useState("jmauwerb@gmail.com");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { classes } = props;

  return (
    <div>
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <Typography variant="h2" className={classes.pageTitle}>
            Log in
          </Typography>
          <form>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              helperText={errors.emailError}
              error={errors ? true : false}
              className={classes.textField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              helperText={errors.passwordError}
              error={errors ? true : false}
              className={classes.textField}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Already have an account? Log in <Link to="/login">here</Link>.
            </p>
          </form>
        </Grid>
        <Grid item sm />
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Login);
