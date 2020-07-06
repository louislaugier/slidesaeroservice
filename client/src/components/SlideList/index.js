import React, {useEffect, useState} from "react"
import {withStyles} from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import FilterIcon from "@material-ui/icons/FilterList"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import UpDownIcon from "@material-ui/icons/ImportExport"
import Paper from "@material-ui/core/Paper"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import ArrowDropUpIcon from "@material-ui/icons/ArrowRightAlt"
import InfiniteScroll from "react-infinite-scroll-component"
import Switch from "@material-ui/core/Switch"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControl from "@material-ui/core/FormControl"
import axios from "axios"

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
    flexGrow: 1
  },
  otherTools: {
    marginBottom: 50,
    alignItems: "center"
  },
  toolbar: {
    marginTop: 30,
    width: "100%",
    display: "flex"
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
    display: "inline-block"
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
  arrowUp: {
    transform: "rotate(-90deg)"
  },
  arrowDown: {
    transform: "rotate(90deg)"
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
  switchText: {
    opacity: 0.5
  }
})

function SlideList(props) {
  const [slidesCountState, setSlidesCountState] = useState(0)
  const [scrollState, setScrollState] = useState({
    items: Array.from({length: 0}),
    hasMore: true,
    part: 0
  })
  useEffect(() => {
    const fetchSlidesCount = async () => {
      const result = await axios(props.endpoint + "/slides/count")
      setSlidesCountState(result.data.data)
    }
    fetchSlidesCount()
    const fetchCategories = async () => {
      const result = await axios(props.endpoint + "/slides/categories?is_subcategory=false")
      props.setCategoriesState(result.data.data)
    }
    fetchCategories()
    const fetchSlides = async () => {
      const result = await axios(props.endpoint + "/slides?limit=56&orderby=created_at&order=desc")
      setScrollState({
        items: result.data.data,
        hasMore: true,
        part: 1
      })
    }
    fetchSlides()
  }, [])
  const [slideTypeState, setSlideTypeState] = useState("all")
  const handleSlideTypeChange = (event) => {
    setSlideTypeState(event.target.value)
  }
  const [auctionOnlyState, setAuctionOnlyState] = useState({
    checked: false
  })
  const handleAuctionsOnlyChange = (event) => {
    setAuctionOnlyState({...auctionOnlyState, [event.target.name]: event.target.checked})
  }
  const {classes} = props
  const [orderByState, setOrderByState] = useState(null)
  const [ascDescState, setAscDescState] = useState(null)
  const handleOrderbyOpen = (event) => {
    setOrderByState(event.currentTarget)
  }
  const handleOrderbyClose = () => {
    setOrderByState(null)
  }
  const handleAscdescOpen = (event) => {
    setAscDescState(event.currentTarget)
  }
  const handleAscdescClose = () => {
    setAscDescState(null)
  }
  const [value, setValue] = useState(0)
  const handleCategoryChange = async (event, i) => {
    setValue(i)
    if (i > 0) {
      if (!(props.subCategoriesState !== null && props.subCategoriesState[i-1] !== undefined)) {
        const result = await axios(props.endpoint + "/slides/categories?parent_category_id=" + props.categoriesState[i-1].id)
        props.setSubCategoriesState({
          ...props.subCategoriesState,
          [i]: result.data.data
        })
      }
    }
  }
  return (
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
                value={value}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleCategoryChange}
                aria-label="slide-type"
                variant="scrollable"
                scrollButtons="on"
              >
                <Tab key={0} label={"All (" + slidesCountState + ")"}/>
                {
                  props.categoriesState !== null ? props.categoriesState.map((category, i) => (
                    <Tab key={i+1} label={category.title + " (" + category.slides_count + ")"}/>
                  )) : <></>
                }
              </Tabs>
            </Paper>
          </Grid>
          <Grid
            className={classes.otherTools}
            container
            justify="flex-end"
            item
          >
            <FormControl component="fieldset">
              <RadioGroup className={classes.radioGroup} value={slideTypeState} onChange={handleSlideTypeChange}>
                <FormControlLabel value="all" control={<Radio className={classes.radio}/>} label="All"/>
                <FormControlLabel value="kodak" control={<Radio className={classes.radio}/>} label="Kodak"/>
                <FormControlLabel value="other" control={<Radio className={classes.radio}/>} label="Other"/>
              </RadioGroup>
            </FormControl>
            <div className={classes.toolbarFilter}>
              Sort by
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
                <MenuItem onClick={handleOrderbyClose}>Publish date</MenuItem>
                <MenuItem onClick={handleOrderbyClose}>Price</MenuItem>
                <MenuItem onClick={handleOrderbyClose}>Origin date</MenuItem>
                <MenuItem onClick={handleOrderbyClose}>Rating</MenuItem>
              </Menu>
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleAscdescOpen}
                aria-label="up-down"
                color="inherit"
              >
                <UpDownIcon />
              </IconButton>
              <Menu
                id="asc-desc"
                anchorEl={ascDescState}
                keepMounted
                open={Boolean(ascDescState)}
                onClose={handleAscdescClose}
              >
                <MenuItem onClick={handleAscdescClose}>
                  <ArrowDropUpIcon className={classes.arrowUp}/>
                </MenuItem>
                <MenuItem onClick={handleAscdescClose}>
                  <ArrowDropUpIcon className={classes.arrowDown}/>
                </MenuItem>
              </Menu>
            </div>
            <div className="Auctions-Only">
              <FormControlLabel
                control={<IOSSwitch checked={auctionOnlyState.checkedB} onChange={handleAuctionsOnlyChange} name="checked"/>}
              />
              <p className={classes.switchText} style={{opactity: 0.5}}>Auctions only</p>
            </div>
          </Grid>
        </Grid>
        <InfiniteScroll
          dataLength={scrollState.items.length}
          next={() => {
            if (scrollState.items.length >= slidesCountState) {
              setScrollState({
                items: scrollState.items,
                hasMore: false,
                part: scrollState.part
              })
              return
            }
            setTimeout(() => {
              let result = []
              const fetchMoreSlides = async () => {
                result = await axios(
                  props.endpoint + "/slides?limit=56&offset=" + (56 * scrollState.part).toString() + "&orderby=created_at&order=desc",
                )
                setScrollState({
                  items: scrollState.items.concat(result.data.data),
                  hasMore: true,
                  part: scrollState.part + 1
                })
              }
              fetchMoreSlides()
            }, 500)
          }}
          hasMore={scrollState.hasMore}
          >
            {
              scrollState.items !== null ? scrollState.items.map((slide, i) => (
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
                        <span className={classes.slideTitle}>
                          {slide.title}
                        </span>
                        <img style={{
                          height: 152,
                          width: 240,
                          borderRadius: 5
                        }} src={""} alt="Slide"/>
                        <span className={classes.slidePrice}>
                          €{slide.price}
                        </span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )) : <></>
            }
        </InfiniteScroll>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(SlideList)