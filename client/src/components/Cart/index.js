import React, {useEffect, useState} from "react"
import {Cookies} from "react-cookie"
import axios from "axios"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import MaterialTable from 'material-table'

const styles = () => ({
  container: {
    flexGrow: 1
  }
})

export default withStyles(styles)(function Cart(props) {
  const [itemsState, setItemsState] = useState({
    columns: [
      { title: 'Slide', field: 'title' },
      { title: 'Price (€)', field: 'price', type: 'numeric' },
      { title: 'Quantity', field: 'stock', type: 'numeric' }
    ],
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
          setItemsState({
            columns: itemsState.columns,
            slides: items,
            data: itemsState.data
          })
        })
      }
      getCartItems()
    }
  }, [cart, props.endpoint, itemsState.columns, itemsState.data])
  const {classes} = props
  return (
    <>
      <Grid container justify="center" className={classes.container}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            <MaterialTable
              title="Cart"
              columns={itemsState.columns}
              data={itemsState.slides}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        setItemsState((prevState) => {
                          const data = [...prevState.data];
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data };
                        });
                      }
                    }, 600);
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    setTimeout(() => {
                      resolve();
                      setItemsState((prevState) => {
                        const data = [...prevState.data];
                        data.splice(data.indexOf(oldData), 1);
                        return { ...prevState, data };
                      });
                    }, 600);
                  }),
              }}
            />
            {itemsState.slides !== [] ? itemsState.slides.map((slide, i) => (
              <>
                <img src={slide.image_path} alt="Slide"/>
                <p key={i}>{slide.title}</p>
                <p key={i}>{slide.price}€</p>
              </>
            )) : <p>Cart is empty</p>}
          </Grid>
        </Grid>
      </Grid>
    </>
  )
})