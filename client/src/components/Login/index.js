import React, {useState} from "react"
import {Cookies} from "react-cookie"
import {Link, Redirect} from "react-router-dom"
import {withStyles} from "@material-ui/core/styles"
import axios from "axios"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"

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
    },
    button: {
        margin: "20px 0"
    },
    remember: {
        display: "flex",
        alignItems: "center",
        position: "relative",
        left: -12,
        marginTop: 15,
        "& > *": {
            fontSize: 15
          }
    }
  })

export default withStyles(theme)(function Login(props) {
    const {classes} = props
    const [emailState, setEmailState] = useState("")
    const [passwordState, setPasswordState] = useState("")
    const sessionToken = new Cookies().get("slidesaeroservice-session")
    if (sessionToken !== undefined) {
        return <Redirect to="/"/>
    } else {
        return (
            <Grid container justify="center">
                <main className={classes.layout}>
                    <h1 className={classes.title}>Login</h1>
                    <form className={classes.form} noValidate autoComplete="off">
                        <TextField onChange={(e) => {
                            setEmailState(e.target.value)
                        }} value={emailState !== "" ? emailState : ""} label="Email"/>
                        <TextField onChange={(e) => {
                            setPasswordState(e.target.value)
                        }} value={passwordState} label="Password" type="password"/>
                        <div className={classes.remember}>
                            <Checkbox color="primary"/>
                            <span>Remember me</span>
                        </div>
                        <div>
                            <Link to="/forgot_password" className={classes.forgot}>Forgot password?</Link> | <Link to="/signup" className={classes.forgot}>Create account</Link>
                        </div>
                        <Button onClick={async () => {
                            const cart = new Cookies().get("slidesaeroservice-cart")
                            const res = await axios(props.endpoint + "/login?guestCart=" + (cart !== undefined ? cart : "none") + "&email=" + emailState + "&password=" + passwordState).catch((e) => {
                                if (e.response.status === 401) {
                                    alert("Wrong credentials. Please try again.")
                                } else {
                                    alert("Unexpected server error.")
                                }
                            })
                            if (res) {
                                let d = new Date()
                                d.setTime(d.getTime() + 2592000000)
                                new Cookies().set("slidesaeroservice-session", res.data.data, {path: "/", expires: d})
                                // get user ID by token and set sas-cart cookie to ID
                                return <Redirect to="/"/>
                            }
                        }} variant="contained" color="primary" className={classes.button}>
                            Login
                        </Button>
                    </form>
                </main>
            </Grid>
        )
    }
})
