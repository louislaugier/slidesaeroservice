import React from "react"
import {makeStyles} from "@material-ui/core/styles"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import CartIcon from "@material-ui/icons/ShoppingCart"
import Menu from "@material-ui/core/Menu"
import MenuIcon from "@material-ui/icons/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import UserIcon from "@material-ui/icons/AccountCircle"
import Paper from "@material-ui/core/Paper"
import InputBase from "@material-ui/core/InputBase"
import SearchIcon from "@material-ui/icons/Search"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import HomeIcon from "@material-ui/icons/Home"
import Divider from "@material-ui/core/Divider"
import AuctionIcon from "@material-ui/icons/Gavel"
import ContactIcon from "@material-ui/icons/Email"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import Collapse from "@material-ui/core/Collapse"
import HelpIcon from "@material-ui/icons/Help"
import MoreIcon from "@material-ui/icons/MoreVert"
import LoginIcon from "@material-ui/icons/ExitToApp"
import SignupIcon from "@material-ui/icons/AssignmentInd"
import Fade from "@material-ui/core/Fade"
import ScrollTopIcon from "@material-ui/icons/KeyboardArrowUp"

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  siteTitle: {
    "font-size": "1.375rem",
    "text-transform": "unset"
  },
  homeTopLeft: {
    display: "flex",
    "align-items": "center"
  },
  flexbar: {
    display: "flex",
    "justify-content": "space-between"
  },
  searchBar: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },
  divider: {
    height: 28,
    margin: 4
  },
  list: {
    width: 250,
  },
  nested: {
    paddingLeft: theme.spacing(6)
  },
  nested2: {
    paddingLeft: theme.spacing(8)
  },
  nestedCateg: {
    paddingLeft: 0
  },
}))

export default function Header() {
  const [scrollTopOpacity, setScrollTopOpacity] = React.useState(0)
  const [scrollTopCursor, setScrollTopCursor] = React.useState("default")
  document.onscroll = function(){
    if (window.pageYOffset > 0){
      setScrollTopOpacity(1)
      setScrollTopCursor("pointer")
    } else {
      window.scrollTo({top: 0, behavior: "smooth"})
      setScrollTopOpacity(0)
      setScrollTopCursor("default")
    }
  }
  const [menuState, setMenuState] = React.useState({
    left: false
  })
  const toggleMenu = (anchor, open) => () => {
    setMenuState({ ...menuState, [anchor]: open })
  }
  const [myAccountNestOpen, setMyAccountNestOpen] = React.useState(false)
  const handleMyAccountNestClick = () => {
    setMyAccountNestOpen(!myAccountNestOpen)
  }
  const [categoriesNestOpen, setCategoriesNestOpen] = React.useState(false)
  const handleCategoriesNestClick = () => {
    setCategoriesNestOpen(!categoriesNestOpen)
  }
  const [subCategoriesNestOpen, setSubCategoriesNestOpen] = React.useState({
    0: false,
    1: false,
    2: false, 
    3: false
  })
  const handleSubCategoriesNestClick = (i) => () => {
    setSubCategoriesNestOpen({...subCategoriesNestOpen, [i]: !subCategoriesNestOpen[i]})
  }
  const [anchorElProfile, setAnchorElProfile] = React.useState(null)
  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget)
  }
  const handleProfileClose = () => {
    setAnchorElProfile(null)
  }
  const [anchorElMore, setAnchorElMore] = React.useState(null)
  const handleMoreClick = (event) => {
    setAnchorElMore(event.currentTarget)
  }
  const handleMoreClose = () => {
    setAnchorElMore(null)
  }
  const classes = useStyles()
  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
    >
      <List>
        <ListItem button key={"home"}>
          <ListItemIcon><HomeIcon/></ListItemIcon>
          <ListItemText primary={"Home"}/>
        </ListItem>
        <ListItem button key={"auctions"}>
          <ListItemIcon><AuctionIcon/></ListItemIcon>
          <ListItemText primary={"Auctions"}/>
        </ListItem>
        <ListItem button key={"cart"}>
          <ListItemIcon><CartIcon/></ListItemIcon>
          <ListItemText primary={"Cart"}/>
        </ListItem>
        <ListItem onClick={handleMyAccountNestClick} button key={"my-account"}>
          <ListItemIcon><UserIcon/></ListItemIcon>
          <ListItemText primary={"Account"}/>
          {myAccountNestOpen ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>
        <Collapse in={myAccountNestOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon><LoginIcon/></ListItemIcon>
              <ListItemText primary="Login"/>
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon><SignupIcon/></ListItemIcon>
              <ListItemText primary="Sign up"/>
            </ListItem>
          </List>
        </Collapse>
        <ListItem button key={"contact"}>
          <ListItemIcon><ContactIcon/></ListItemIcon>
          <ListItemText primary={"Contact"}/>
        </ListItem>
      </List>
      <Divider/>
      <List>
        <ListItem onClick={handleCategoriesNestClick} button key={"categories"}>
          <ListItemText className="Menu-Categories" primary={"Categories"}/>
          {categoriesNestOpen ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>
      </List>
      <Divider/>
      <Collapse in={categoriesNestOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* Map categories state */}
          <ListItem onClick={handleSubCategoriesNestClick(0)} button className={classes.nested}>
            <ListItemText primary="Lorem ipsum"/>
            {subCategoriesNestOpen[0] ? <ExpandLess/> : <ExpandMore/>}
          </ListItem>
          <Collapse in={subCategoriesNestOpen[0]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button className={classes.nested2}>
                  <ListItemText primary="Subcategory"/>
                </ListItem>
                <ListItem button className={classes.nested2}>
                  <ListItemText primary="Subcategory"/>
                </ListItem>
                <ListItem button className={classes.nested2}>
                  <ListItemText primary="Subcategory"/>
                </ListItem>
                <ListItem button className={classes.nested2}>
                  <ListItemText primary="Subcategory"/>
                </ListItem>
              </List>
          </Collapse>
        </List>
      </Collapse>
    </div>
  )
  return (
    <>
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar className={classes.flexbar}>
            <div className={classes.homeTopLeft}>
              <IconButton
                onClick={toggleMenu("left", !menuState["left"])}
                onKeyDown={toggleMenu("left", false)}
                aria-label="menu"
                color="inherit"
              >
                <MenuIcon/>
              </IconButton>
              <Button className={classes.siteTitle} color="inherit">
                SlidesAeroService
              </Button>
            </div>
            <Paper component="form" className={classes.searchBar}>
              <InputBase
                className={classes.input}
                placeholder="Search for a slide, category or subcategory"
                inputProps={{
                  "aria-label": "search for a slide, category or subcategory",
                }}
            />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon/>
              </IconButton>
            </Paper>
            <div>
              <IconButton aria-label="cart" color="inherit">
                <CartIcon/>
              </IconButton>
              <IconButton
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleProfileClick}
                color="inherit"
                aria-label="account"
              >
                <MoreIcon/>
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorElProfile}
                keepMounted
                open={Boolean(anchorElProfile)}
                onClose={handleProfileClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleProfileClose}>Login</MenuItem>
                <MenuItem onClick={handleProfileClose}>Sign up</MenuItem>
              </Menu>
              <IconButton
                aria-controls="more"
                aria-haspopup="true"
                onClick={handleMoreClick}
                color="inherit"
                aria-label="more"
              >
                <HelpIcon/>
              </IconButton>
              <Menu
                id="more-menu"
                anchorEl={anchorElMore}
                keepMounted
                open={Boolean(anchorElMore)}
                onClose={handleMoreClose}
                TransitionComponent={Fade}
              >
                <MenuItem onClick={handleMoreClose}>About</MenuItem>
                <Divider/>
                <MenuItem onClick={handleMoreClose}>Terms of use</MenuItem>
                <MenuItem onClick={handleMoreClose}>Privacy policy</MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor={"left"}
          open={menuState["left"]}
          onClose={toggleMenu("left", false)}
        >
          {list("left")}
        </Drawer>
      </div>
      <div style={{
        opacity: scrollTopOpacity
      }} onClick={(e) => {
        e.preventDefault()
        window.scrollTo({top: 0, behavior: "smooth"})
      }} className="Scroll-Top">
        <IconButton
          aria-label="scroll-top"
          style={{
            cursor: scrollTopCursor
          }}
        >
          <ScrollTopIcon/>
        </IconButton>
      </div>
      
    </>
  )
}
