import React, {useEffect, useState} from "react"
import {Cookies} from "react-cookie"
import {Link} from "react-router-dom"
import axios from "axios"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Paper from "@material-ui/core/Paper"
import Stepper from "@material-ui/core/Stepper"
import Step from "@material-ui/core/Step"
import StepLabel from "@material-ui/core/StepLabel"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Select from "@material-ui/core/Select"
import MenuItem from "@material-ui/core/MenuItem"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"

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
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(18),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  image: {
    width: 155,
    height: 95,
    borderRadius: 5
  },
  item: {
    display: "flex",
    marginBottom: 50
  },
  title: {
    fontSize: 18
  },
  description: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  itemContainer: {
    marginLeft: 30,
    width: "72.5%"
  },
  remove: {
    textDecoration: "underline"
  },
  price: {
    fontWeight: 800,
    fontSize: 16
  }
})

export default withStyles(theme)(function Cart(props) {
  const {classes} = props
  const [itemsState, setItemsState] = useState({
    slides: []  
  })
  const cart = new Cookies().get("slidesaeroservice")
  useEffect(() => {
    if (cart !== undefined) {
      const getCartItems = async () => {
        let IDs = await axios(props.endpoint + "/cart?key=" + cart)
        let items = []
        IDs.data.data.forEach(async (id, i) => {
          let item = await axios(props.endpoint + "/slides?id=" + id)
          items.push(item.data.data[0])
          items.forEach((item, i) => {
            items.forEach((otherItem, j) => {
              if (i !== j && items[i].id === items[j].id) {
                items[i].count = items[i].count + 1 || 2
                if (items[i].count > items[i].stock) {
                  items[i].count = items[i].stock
                }
                delete items[j]
              }
            })
          })
          setItemsState({
            slides: items
          })
        })
      }
      getCartItems()
    }
  }, [cart, props.endpoint, itemsState.columns])
  const steps = ["Cart", "Shipping", "Checkout"]
  const handleNext = () => {
    props.setActiveCartStep(props.activeCartStep + 1)
    if (props.activeCartStep === 2) {
      alert("PayPal redirect")
    }
  }
  const handleBack = () => {
    props.setActiveCartStep(props.activeCartStep - 1)
  }
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const handleDialog = () => {
    setDialogOpen(!dialogOpen)
  }
  return (
    <>
      <Grid container justify="center">
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography component="h1" variant="h4" align="center">
              {steps[props.activeCartStep]}
            </Typography>
            <Stepper activeStep={props.activeCartStep} className={classes.stepper}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <>
              {props.activeCartStep === steps.length ? (
                <>
                  <Typography variant="h5" gutterBottom>
                    Thank you for your order!
                  </Typography>
                  <Typography variant="subtitle1">
                    Order #2001539 awaiting payment.
                  </Typography>
                  <Link to="/">
                    <Button className={classes.button}>
                      Home
                    </Button>
                  </Link>
                  <Link to="/orders">
                    <Button variant="contained" color="primary" className={classes.button}>
                      View orders
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <div id="cart-items" className={classes.items}>
                    
                    {props.activeCartStep === 0 ? <>
                      {itemsState.slides.length === 0 ? <i style={{textAlign: "center", display: "block", marginTop: 25}}>Cart is empty</i> : <></>}
                      {itemsState.slides.map((slide, i) => (
                        <div className={classes.item} key={i}>
                          <Link to={"/" + slide.title.toLowerCase().replace(/ /g, "_")}>
                            <img className={classes.image} src={slide.image_path} alt="Slide"/>
                          </Link>
                          <div className={classes.itemContainer}>
                            <div className={classes.description}>
                              <Link to={"/" + slide.title.toLowerCase().replace(/ /g, "_")} className={classes.title}>{slide.title}</Link>
                              <Select onChange={(e) => {
                                let items = itemsState.slides
                                let diff = items[i].count - e.target.value
                                if (diff > 0) {
                                  items[i].count = e.target.value
                                  setItemsState({
                                    slides: items
                                  })
                                  axios.delete(props.endpoint + "/cart?key=" + cart + "&slide=" + slide.id + "&count=" + diff)
                                } else if (diff < 0) {
                                  items[i].count = e.target.value
                                  setItemsState({
                                    slides: items
                                  })
                                  axios.post(props.endpoint + "/cart?key=" + cart + "&slide=" + slide.id + "&count=" + Math.abs(diff))
                                }
                              }} value={slide.count || 1}>
                                {[...Array(slide.stock)].map((e, i) => {
                                  return <MenuItem key={i} value={i+1}>{i+1}</MenuItem>
                                })}
                              </Select>
                              <p className={classes.price}>{slide.price * (slide.count || 1)}€</p>
                            </div>
                            <Link to="/cart" onClick={handleDialog} className={classes.remove}>
                              Remove
                            </Link>
                          </div>
                          <Dialog
                            open={dialogOpen}
                            onClose={handleDialog}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">{"Remove slide"}</DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to remove this slide from your cart?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleDialog} color="primary">
                                Cancel
                              </Button>
                              <Button onClick={async () => {
                                handleDialog()
                                let items = itemsState.slides
                                delete itemsState.slides[i]
                                setItemsState({
                                  slides: items
                                })
                                await axios.delete(props.endpoint + "/cart?key=" + cart + "&slide=" + slide.id + "&count=" + slide.count || 1)
                              }} color="primary" autoFocus>
                                Confirm
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </div>
                      ))
                    }</> : <></>}
                  </div>
                  {props.activeCartStep === 1 ? <>
                    Shipping
                  </> : <></>}
                  {props.activeCartStep === 2 ? <>
                    Checkout
                  </> : <></>}
                  <div className={classes.buttons}>
                    {props.activeCartStep !== 0 && (
                      <Button onClick={handleBack} className={classes.button}>
                        Back
                      </Button>
                    )}
                      <Button
                        disabled={itemsState.slides.length === 0 ? true : false}
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        className={classes.button}
                      >
                        {props.activeCartStep === steps.length - 1 ? "Place order" : "Next"}
                      </Button>
                  </div>
                </>
              )}
            </>
          </Paper>
          <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "} SlidesAeroService {new Date().getFullYear() + "."}
          </Typography>
        </main>
      </Grid>
    </>
  )
})
