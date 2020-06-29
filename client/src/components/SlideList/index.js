import React from "react"
import { withStyles } from "@material-ui/core/styles"
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

const styles = (theme) => ({
  container: {
    flexGrow: 1
  },
  toolbar: {
    margin: "50px 0 100px 0",
    width: "100%",
    display: "flex"
  },
  toolbarFilter: {
    display: "inline-block"
  },
  filter: {
    marginLeft: 5
  },
  paper: {
    display: "inline-block",
    width: "52.5vw"
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
})

function SlideList(props) {
  const { classes } = props
  const [anchorElOrderby, setanchorElOrderby] = React.useState(null)
  const [anchorElAscdesc, setanchorElAscdesc] = React.useState(null)
  const handleOrderbyOpen = (event) => {
    setanchorElOrderby(event.currentTarget)
  }
  const handleOrderbyClose = () => {
    setanchorElOrderby(null)
  }
  const handleAscdescOpen = (event) => {
    setanchorElAscdesc(event.currentTarget)
  }
  const handleAscdescClose = () => {
    setanchorElAscdesc(null)
  }
  const [value, setValue] = React.useState(0)
  const handleCategoryChange = (event, newValue) => {
    setValue(newValue)
  }
  return (
    <Grid container justify="center" className={classes.container}>
      <Grid item xs={8}>
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
                <Tab label="All" />
                <Tab label="Boeing (354)" />
                <Tab label="Airbus (266)" />
                <Tab label="Lockheed (92)" />
                <Tab label="Russian Types" />
                <Tab label="French Types" />
                <Tab label="English Types" />
                <Tab label="English Types" />
                <Tab label="English Types" />
              </Tabs>
            </Paper>
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
                <FilterIcon />
              </IconButton>
              <Menu
                id="orderby"
                anchorEl={anchorElOrderby}
                keepMounted
                open={Boolean(anchorElOrderby)}
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
                anchorEl={anchorElAscdesc}
                keepMounted
                open={Boolean(anchorElAscdesc)}
                onClose={handleAscdescClose}
              >
                <MenuItem onClick={handleAscdescClose}>
                  <ArrowDropUpIcon className={classes.arrowUp} />
                </MenuItem>
                <MenuItem onClick={handleAscdescClose}>
                  <ArrowDropUpIcon className={classes.arrowDown} />
                </MenuItem>
              </Menu>
            </div>
          </Grid>
        </Grid>

          <Grid
            className="Slides-Container"
            container
            justify="space-between"
            spacing={3}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62].map((value) => (
              <Grid key={value} item>
                <Card className={classes.card}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Title
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(SlideList)