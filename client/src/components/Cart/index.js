import React, {useEffect, useState} from "react"
import {Cookies} from "react-cookie"
import axios from "axios"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"

const styles = () => ({
  container: {
    flexGrow: 1
  }
})

export default withStyles(styles)(function Cart(props) {
  const [itemsState, setItemsState] = useState(null)
  const cart = new Cookies().get("slidesaeroservice")
  useEffect(() => {
    if (cart !== undefined) {
      const getCartItems = async () => {
        let IDs = await axios(props.endpoint + "/cart?key=" + cart)
        let items = []
        IDs.data.data.forEach(async (id) => {
          let item = await axios(props.endpoint + "/slides?id=" + id)
          items.push(item.data.data[0])
        })
        setItemsState(items)
      }
      getCartItems()
    }
  }, [cart, props.endpoint])
  const {classes} = props
  if (itemsState !== null) {
    console.log(itemsState)
    console.log(itemsState.length)
  }
  return (
    <>
      <Grid container justify="center" className={classes.container}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            {itemsState !== null ? itemsState.map((item, i) => (
              <p key={i}>{item.title}</p>
            )) : <p>Cart is empty</p>}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
})