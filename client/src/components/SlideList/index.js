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
    alignItems: "center",
    marginLeft: 40
  },
  toolbar: {
    marginTop: 30,
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
  },
  infiniteScroll: {
    marginTop: 20
  }
})

function SlideList(props) {
  const {classes} = props
  const [slidesCountState, setSlidesCountState] = useState(0)
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
  const handleCategoryChange = async (event, i) => {
    props.setSelectedTab(i)
    if (i > 0) {
      props.setSelectedSubTab({
        barstyle: {
          opacity: 1,
          zIndex: 0,
          position: "relative",
        },
        tab: 0
      })
      const subCategories = await axios(props.endpoint + "/slides/categories?parent_category_id=" + props.categoriesState[i - 1].id)
      props.setSubCategoriesState({
        ...props.subCategoriesState,
        current: props.categoriesState[i - 1].title,
        count: props.categoriesState[i - 1].slides_count,
        [i]: subCategories.data.data
      })
      if (!('slides' in props.categoriesState[i - 1])) {
        props.categoriesState[i - 1].slides = []
        props.scrollState.items.forEach(slide => {
          if (slide.category_id === props.categoriesState[i - 1].id) {
            props.categoriesState[i - 1].slides.push(slide)
          }
        })
      }
      if (props.categoriesState[i - 1].slides.length < 56) {
        const fillSlides = await axios(props.endpoint + "/slides?category_id=" + props.categoriesState[i - 1].id + "&limit=" + (56 - props.categoriesState[i - 1].slides.length).toString() + "&offset=" + props.categoriesState[i - 1].slides.length)
        props.categoriesState[i - 1].slides = props.categoriesState[i - 1].slides.concat(fillSlides.data.data)
      }
      props.setScrollState({
        items: props.categoriesState[i - 1].slides,
        hasMore: props.categoriesState[i - 1].slides_count > props.categoriesState[i - 1].slides.length ? true : false,
        part: Math.ceil(props.categoriesState[i - 1].slides.length / 56)
      })
      props.setInitialSlides({
        ...props.initialSlides,
        [i - 1]: props.categoriesState[i - 1].slides
      })
    } else {
      props.setSelectedSubTab({
        barStyle: {
          opacity: 0,
          zIndex: -1,
          position: "absolute"
        },
        tab: 0
      })
      props.setSubCategoriesState({
        ...props.subCategoriesState,
        count: 0,
        current: ""
      })
      props.setScrollState({
        items: props.initialSlides.all,
        hasMore: true,
        part: 1
      })
    }
  }
  const handleSubCategoryChange = async (event, i) => {
    props.setSelectedSubTab({
      barStyle: props.selectedSubTab.barStyle,
      tab: i
    })
    if (i > 0) {
      if (!("slides" in props.subCategoriesState[props.selectedTab][i - 1])) {
        props.subCategoriesState[props.selectedTab][i - 1].slides = []
        props.scrollState.items.forEach(slide => {
          if (slide.subcategory_id === props.subCategoriesState[props.selectedTab][i - 1].id) {
            props.subCategoriesState[props.selectedTab][i - 1].slides.push(slide)
          }
        })
      }
      if (props.subCategoriesState[props.selectedTab][i - 1].slides.length < 56) {
        const fillSlides = await axios(props.endpoint + "/slides?subcategory_id=" + props.subCategoriesState[props.selectedTab][i - 1].id + "&limit=" + (56 - props.subCategoriesState[props.selectedTab][i - 1].slides.length).toString() + "&offset=" + props.subCategoriesState[props.selectedTab][i - 1].slides.length)
        props.subCategoriesState[props.selectedTab][i - 1].slides = props.subCategoriesState[props.selectedTab][i - 1].slides.concat(fillSlides.data.data)
      }
      props.setScrollState({
        items: props.subCategoriesState[props.selectedTab][i - 1].slides,
        hasMore: props.subCategoriesState[props.selectedTab][i - 1].slides_count > props.subCategoriesState[props.selectedTab][i - 1].slides.length ? true : false,
        part: Math.ceil(props.subCategoriesState[props.selectedTab][i - 1].slides.length / 56)
      })
    } else {
      props.setSelectedSubTab({
        barStyle: props.selectedSubTab.barStyle,
        tab: 0
      })
      props.setScrollState({
        items: props.initialSlides[props.selectedTab-1],
        hasMore: props.categoriesState[props.selectedTab - 1].slides_count > 56 ? true : false,
        part: 1
      })
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
                value={props.selectedTab}
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
                onChange={handleSubCategoryChange}
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
            return slidesCountState
          }}
          next={() => {
            let count = slidesCountState
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
                        <span className={classes.slideTitle}>
                          {slide.title}
                        </span>
                        <img style={{
                          height: 152,
                          width: 240,
                          borderRadius: 5
                        }} alt="Slide"/>
                        <span className={classes.slidePrice}>
                          €{slide.price}
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
  )
}

export default withStyles(styles)(SlideList)