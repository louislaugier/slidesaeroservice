import React from "react"
import {Link} from "react-router-dom"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
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
    forgot: {
        textDecoration: "underline",
        fontSize: 14,
        position: "relative",
        left: -10
    },
    button: {
        margin: "20px 0"
    }
  })

export default withStyles(theme)(function Contact(props) {
  const {classes} = props
  return (
    <Grid container justify="center">
        <main className={classes.layout}>
            <Paper className={classes.paper}>
                <h1 className={classes.title}>Contact support</h1>
                <form className={classes.form} noValidate autoComplete="off">
                    <TextField id="standard-name" label="Name"/>
                    <TextField id="standard-email" label="Email"/>
                    <TextField id="standard-subject" label="Subject"/>
                    <TextField id="standard-message" multiline rows={6} label="Message"/>
                    <Button variant="contained" color="primary" className={classes.button}>
                        <Link to="/">
                            Send
                        </Link>
                    </Button>
                </form>
            </Paper>
        </main>
    </Grid>
  )
})
