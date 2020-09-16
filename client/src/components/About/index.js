import React from "react"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"

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
    paper: {
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(3),
        padding: theme.spacing(2),
        [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
            marginTop: theme.spacing(6),
            marginBottom: theme.spacing(6),
            padding: theme.spacing(3)
        }
    },
    title: {
        textAlign: "center",
        marginBottom: 25,
        marginTop: 0
    }
  })

export default withStyles(theme)(function About(props) {
  const {classes} = props
  return (
    <Grid container justify="center">
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <h1 className={classes.title}>About</h1>
                <p>Description</p>
            </Paper>
        </main>
    </Grid>
  )
})
