import React, {useEffect, useState} from "react"
import axios from "axios"
import {Cookies} from "react-cookie"
import {Link} from "react-router-dom"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart'
import IconButton from "@material-ui/core/IconButton"
import FilterIcon from "@material-ui/icons/FilterList"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Paper from "@material-ui/core/Paper"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import InfiniteScroll from "react-infinite-scroll-component"
import Switch from "@material-ui/core/Switch"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControl from "@material-ui/core/FormControl"
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'
import CloseIcon from '@material-ui/icons/Close'

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: 42,
    height: 26,
    padding: 0,
    margin: theme.spacing(1)
  },
  switchBase: {
    padding: 1,
    "&$checked": {
      transform: "translateX(16px)",
      color: theme.palette.common.white,
      "& + $track": {
        backgroundColor: "#3f51b5",
        opacity: 1,
        border: "none"
      }
    },
    "&$focusVisible $thumb": {
      color: "#3f51b5",
      border: "6px solid #fff"
    }
  },
  thumb: {
    width: 24,
    height: 24
  },
  track: {
    borderRadius: 26 / 2,
    border: `1px solid ${theme.palette.grey[400]}`,
    backgroundColor: theme.palette.grey[50],
    opacity: 1,
    transition: theme.transitions.create(["background-color", "border"])
  },
  checked: {},
  focusVisible: {}
}))(({ classes, ...props }) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked
      }}
      {...props}
    />
  )
})

const styles = (theme) => ({
  container: {
    flexGrow: 1,
    display: "block !important"
  },
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    }
  },
  otherTools: {
    alignItems: "center",
    marginLeft: 40
  },
  toolbar: {
    marginTop: 128,
    width: "100%",
    display: "flex"
  },
  subToolbar: {
    marginBottom: 30,
    width: "100%",
    transition: ".3s",
    display: "flex",
    left: 0,
    bottom: 0
  },
  radioGroup: {
    marginRight: 50,
    "flex-direction": "row"
  },
  radio: {
    "&&:hover": {
      backgroundColor: "#F5F5F5"
    }
  },
  toolbarFilter: {
    display: "inline-block",
  },
  filter: {
    marginLeft: 5
  },
  paper: {
    width: "100%"
  },
  control: {
    padding: theme.spacing(2)
  },
  card: {
    minWidth: 175,
    height: 140
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  slidePrice: {
    color: "black"
  },
  slideTitle: {
    textAlign: "center",
    height: 48,
    display: "flex",
    alignItems: "center"
  },
  infiniteScroll: {
    marginTop: 20
  }
})

export default withStyles(styles)(function SlideList(props) {
  const {classes} = props
  useEffect(() => {
    const fetchSlidesCount = async () => {
      const result = await axios(props.endpoint + "/slides/count")
      props.setSlidesCountState(result.data.data)
    }
    fetchSlidesCount()
    const fetchCategories = async () => {
      const result = await axios(props.endpoint + "/slides/categories?is_subcategory=false")
      props.setCategoriesState(result.data.data)
    }
    fetchCategories()
    const fetchSlides = async () => {
      const result = await axios(props.endpoint + "/slides?limit=56&orderby=created_at&order=desc")
      props.setScrollState({
        items: result.data.data,
        hasMore: true,
        part: 1
      })
      props.setInitialSlides({
        all: result.data.data
      })
    }
    fetchSlides()
    // eslint-disable-next-line
  }, [props.endpoint, props.setSlidesCountState, props.setCategoriesState, props.setScrollState, props.setInitialSlides])
  const [slideTypeState, setSlideTypeState] = useState("all")
  const handleSlideTypeChange = (event) => {
    setSlideTypeState(event.target.value)
  }
  const [orderByState, setOrderByState] = useState(null)
  const handleOrderbyOpen = (event) => {
    setOrderByState(event.currentTarget)
  }
  const handleOrderbyClose = () => {
    setOrderByState(null)
  }
  const [alertOpen, setAlertOpen] = React.useState(false)
  return (
    <>
      <Grid container justify="center" className={classes.container}>
        <Grid item xs={12}>
          <Grid container justify="space-between">
            <Grid
              container
              justify="space-between"
              className={classes.toolbar}
              item
            >
              <Paper className={classes.paper} square>
                <Tabs
                  value={props.selectedTab}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={props.handleCategoryChange}
                  aria-label="slide-type"
                  variant="scrollable"
                  scrollButtons="on"
                >
                  <Tab key={0} label={"All (" + props.slidesCountState + ")"}/>
                  {
                    props.categoriesState !== null ? props.categoriesState.map((category, i) => (
                      <Tab key={i+1} label={category.title + " (" + category.slides_count + ")"}/>
                    )) : null
                  }
                </Tabs>
              </Paper>
            </Grid>
            <Grid
              className={classes.otherTools}
              container
              item
            >
              <FormControl component="fieldset">
                <RadioGroup className={classes.radioGroup} value={slideTypeState} onChange={handleSlideTypeChange}>
                  <FormControlLabel value="all" control={<Radio className={classes.radio}/>} label="All"/>
                  <FormControlLabel value="kodak" control={<Radio className={classes.radio}/>} label="Kodak"/>
                  <FormControlLabel value="provia" control={<Radio className={classes.radio}/>} label="Provia"/>
                </RadioGroup>
              </FormControl>
              <div className={classes.toolbarFilter}>
                Sort
                <IconButton
                  className={classes.filter}
                  aria-label="filter"
                  color="inherit"
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleOrderbyOpen}
                >
                  <FilterIcon/>
                </IconButton>
                <Menu
                  id="orderby"
                  anchorEl={orderByState}
                  keepMounted
                  open={Boolean(orderByState)}
                  onClose={handleOrderbyClose}
                >
                  <MenuItem onClick={handleOrderbyClose}>Lowest to highest price</MenuItem>
                  <MenuItem onClick={handleOrderbyClose}>Highest to lowest price</MenuItem>
                  <MenuItem onClick={handleOrderbyClose}>Newest to oldest</MenuItem>
                  <MenuItem onClick={handleOrderbyClose}>Oldest to newest</MenuItem>
                </Menu>
              </div>
              <Link to={props.switchURL}>
                <div className="Auctions-Only">
                  <FormControlLabel
                    control={<IOSSwitch checked={props.auctionOnlyState} name="checked"/>}
                  />
                  <p style={{opacity: props.switchTextOpacity}}>Auctions only</p>
                </div>
              </Link>
            </Grid>
            <Grid
              container
              justify="space-between"
              className={classes.subToolbar}
              item
              style={props.selectedSubTab.barStyle}
            >
              <Paper className={classes.paper} square>
                <Tabs
                  value={props.selectedSubTab.tab}
                  indicatorColor="primary"
                  textColor="primary"
                  onChange={props.handleSubCategoryChange}
                  aria-label="slide-type"
                  variant="scrollable"
                  scrollButtons="on"
                >
                  <Tab key={0} label={"All " + props.subCategoriesState.current + " (" + props.subCategoriesState.count + ")"}/>
                  {
                    props.subCategoriesState !== null && props.subCategoriesState[props.selectedTab] !== undefined ? props.subCategoriesState[props.selectedTab].map((category, i) => (
                      <Tab key={i+1} label={category.title + " (" + category.slides_count + ")"}/>
                    )) : null
                  }
                </Tabs>
              </Paper>
            </Grid>
          </Grid>
          <InfiniteScroll
            dataLength={() => {
              if (props.selectedTab > 0) {
                return props.categoriesState[props.selectedTab - 1].slides_count
              }
              return props.slidesCountState
            }}
            next={() => {
              let count = props.slidesCountState
              let category = ""
              if (props.selectedTab > 0) {
                count = props.categoriesState[props.selectedTab - 1].slides_count
                category = "&category_id=" + props.categoriesState[props.selectedTab - 1].id
                if (props.selectedSubTab.tab > 0) {
                  count = props.subCategoriesState[props.selectedTab][props.selectedSubTab.tab - 1].slides_count
                  category = "&subcategory_id=" + props.subCategoriesState[props.selectedTab][props.selectedSubTab.tab - 1].id
                }
              }
              if (props.scrollState.items.length >= count)  {
                props.setScrollState({
                  items: props.scrollState.items,
                  hasMore: false,
                  part: props.scrollState.part
                })
                return
              }
              setTimeout(() => {
                let result = []
                const fetchMoreSlides = async () => {
                  result = await axios(
                    props.endpoint + "/slides?limit=56&offset=" + (56 * props.scrollState.part).toString() + "&orderby=created_at&order=desc" + category,
                  )
                  props.setScrollState({
                    items: props.scrollState.items.concat(result.data.data),
                    hasMore: true,
                    part: props.scrollState.part + 1
                  })
                }
                fetchMoreSlides()
              }, 500)
            }}
            hasMore={props.scrollState.hasMore}
            className={classes.infiniteScroll}
            >
              {
                props.scrollState.items !== null ? props.scrollState.items.map((slide, i) => (
                  <Grid key={i} item>
                    <Card style={{
                        height: 240,
                        width: 300,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }} className={classes.card}
                    >
                      <CardContent>
                        <Typography color="textSecondary" gutterBottom>
                          <Link to={"/" + slide.title.toLowerCase().replace(/ /g, '_')}>
                            <span className={classes.slideTitle}>
                              {slide.title}
                            </span>
                          </Link>
                          <img style={{
                            height: 152,
                            width: 240,
                            borderRadius: 5
                          }} src={slide.image_path} alt="Slide"/>
                          <span className="Slide-layer">
                            <IconButton onClick={async () => {
                              setAlertOpen(true)
                              let key = ""
                              let d = new Date()
                              d.setTime(d.getTime() + 2592000000)
                              const cookies = new Cookies()
                              if (cookies.get("slidesaeroservice") === undefined) {
                                key = "new_guest_cookie"
                              } else {
                                key = cookies.get("slidesaeroservice")
                              }
                              await axios.post(props.endpoint + "/cart?key=" + key + "&slide=" + slide.id)
                              .then((res) => {
                                cookies.set("slidesaeroservice", res.data.data, {path: "/", expires: d})
                              })
                              .catch((e) => {
                                console.log(e)
                              })
                            }} className="Add-to-cart">
                              <AddShoppingCartIcon fontSize="large" className="Add-to-cart-icon"/>
                            </IconButton>
                          </span>
                          <span className={classes.slidePrice}>
                            {slide.price}€
                          </span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )) : null
              }
          </InfiniteScroll>
        </Grid>
      </Grid>
      <div className={classes.alert}>
        <Collapse in={alertOpen}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false)
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            className="Alert"
          >
            Added slide to cart
          </Alert>
        </Collapse>
      </div>
    </>
  )
})