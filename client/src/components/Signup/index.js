import React from "react"
import {Link} from "react-router-dom"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

const theme = (theme) => ({
    container: {
      flexGrow: 1
    },
    layout: {
        width: "auto",
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
            width: 900,
            marginLeft: "auto",
            marginRight: "auto"
        }
    },
    title: {
        textAlign: "center",
        marginBottom: 25,
        marginTop: 0
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "& > *": {
          margin: theme.spacing(1),
          width: "25ch"
        }
    },
    button: {
        marginTop: 40
    }
  })

export default withStyles(theme)(function Signup(props) {
  const {classes} = props
  return (
    <Grid container justify="center">
        <main className={classes.layout}>
            <h1 className={classes.title}>Sign up</h1>
            <form className={classes.form} noValidate autoComplete="off">
                <TextField label="Email"/>
                <TextField label="Password" type="password"/>
                <TextField label="Confirm password" type="password"/>
                <Button variant="contained" color="primary" className={classes.button}>
                    <Link to="/">
                        Create account
                    </Link>
                </Button>
            </form>
        </main>
    </Grid>
  )
})
