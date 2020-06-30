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
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import Divider from '@material-ui/core/Divider'

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
  }
}))

export default function Header() {
  const [menuState, setMenuState] = React.useState({
    left: false
  })
  const toggleMenu = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return
    }
    setMenuState({ ...menuState, [anchor]: open })
  }
  const [anchorElProfile, setAnchorElProfile] = React.useState(null)
  const handleProfileClick = (event) => {
    setAnchorElProfile(event.currentTarget)
  }
  const handleProfileClose = () => {
    setAnchorElProfile(null)
  }
  const classes = useStyles()
  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleMenu(anchor, false)}
      onKeyDown={toggleMenu(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  )
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.flexbar}>
          <div className={classes.homeTopLeft}>
            <IconButton
              onClick={toggleMenu("left", true)}
              onKeyDown={toggleMenu("left", false)}
              aria-label="cart"
              color="inherit"
            >
              <MenuIcon />
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
              <SearchIcon />
            </IconButton>
          </Paper>
          <div>
            <IconButton aria-label="cart" color="inherit">
              <CartIcon />
            </IconButton>
            <IconButton
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleProfileClick}
              className={classes.menuButton}
              color="inherit"
              aria-label="account"
            >
              <UserIcon />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorElProfile}
              keepMounted
              open={Boolean(anchorElProfile)}
              onClose={handleProfileClose}
            >
              <MenuItem onClick={handleProfileClose}>Login</MenuItem>
              <MenuItem onClick={handleProfileClose}>Sign up</MenuItem>
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
  )
}
