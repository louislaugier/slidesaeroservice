import React, {useState} from "react"
import ReactDOM from "react-dom"
import "./App.css"
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import * as serviceWorker from "./serviceWorker"
import Header from "./components/Header"
import SlideList from "./components/SlideList"
import Cart from "./components/Cart"
import MUICookieConsent from 'material-ui-cookie-consent'
import axios from "axios"

function App() {
  if (!navigator.cookieEnabled) {
    alert("Cookies must be enabled to use this website.")
    window.location = "/"
  }
  const endpoint = "http://localhost:8080/api/v1"
  const [slidesCountState, setSlidesCountState] = useState(0)
  const [initialSlides, setInitialSlides] = useState(null)
  const [scrollState, setScrollState] = useState({
    items: Array.from({ length: 0 }),
    hasMore: true,
    part: 0
  })
  const [categoriesState, setCategoriesState] = useState(null)
  const [subCategoriesState, setSubCategoriesState] = useState({
    count: 0,
    current: ""
  })
  const [selectedTab, setSelectedTab] = useState(0)
  const [selectedSubTab, setSelectedSubTab] = useState({
    barStyle: {
      opacity: 0,
      zIndex: -1,
      position: "absolute"
    },
    tab: 0
  })
  const handleCategoryChange = async (event, i) => {
    setSelectedTab(i)
    if (i > 0) {
      setSelectedSubTab({
        barstyle: {
          opacity: 1,
          zIndex: 0,
          position: "relative",
        },
        tab: 0
      })
      const subCategories = await axios(endpoint + "/slides/categories?parent_category_id=" + categoriesState[i - 1].id)
      setSubCategoriesState({
        ...subCategoriesState,
        current: categoriesState[i - 1].title,
        count: categoriesState[i - 1].slides_count,
        [i]: subCategories.data.data
      })
      if (!('slides' in categoriesState[i - 1])) {
        categoriesState[i - 1].slides = []
        scrollState.items.forEach(slide => {
          if (slide.category_id === categoriesState[i - 1].id) {
            categoriesState[i - 1].slides.push(slide)
          }
        })
      }
      if (categoriesState[i - 1].slides.length < 56) {
        const fillSlides = await axios(endpoint + "/slides?category_id=" + categoriesState[i - 1].id + "&limit=" + (56 - categoriesState[i - 1].slides.length).toString() + "&offset=" + categoriesState[i - 1].slides.length)
        categoriesState[i - 1].slides = categoriesState[i - 1].slides.concat(fillSlides.data.data)
      }
      setScrollState({
        items: categoriesState[i - 1].slides,
        hasMore: categoriesState[i - 1].slides_count > categoriesState[i - 1].slides.length ? true : false,
        part: Math.ceil(categoriesState[i - 1].slides.length / 56)
      })
      setInitialSlides({
        ...initialSlides,
        [i - 1]: categoriesState[i - 1].slides
      })
    } else {
      if (initialSlides !== null) {
        await setScrollState({
          items: initialSlides.all,
          hasMore: true,
          part: 1
        })
      }
      setSelectedSubTab({
        barStyle: {
          opacity: 0,
          zIndex: -1,
          position: "absolute"
        },
        tab: 0
      })
      setSubCategoriesState({
        ...subCategoriesState,
        count: 0,
        current: ""
      })
    }
  }
  const handleSubCategoryChange = async (event, i) => {
    setSelectedSubTab({
      barStyle: selectedSubTab.barStyle,
      tab: i
    })
    if (i > 0) {
      if (!("slides" in subCategoriesState[selectedTab][i - 1])) {
        subCategoriesState[selectedTab][i - 1].slides = []
        scrollState.items.forEach(slide => {
          if (slide.subcategory_id === subCategoriesState[selectedTab][i - 1].id) {
            subCategoriesState[selectedTab][i - 1].slides.push(slide)
          }
        })
      }
      if (subCategoriesState[selectedTab][i - 1].slides.length < 56) {
        const fillSlides = await axios(endpoint + "/slides?subcategory_id=" + subCategoriesState[selectedTab][i - 1].id + "&limit=" + (56 - subCategoriesState[selectedTab][i - 1].slides.length).toString() + "&offset=" + subCategoriesState[selectedTab][i - 1].slides.length)
        subCategoriesState[selectedTab][i - 1].slides = subCategoriesState[selectedTab][i - 1].slides.concat(fillSlides.data.data)
      }
      setScrollState({
        items: subCategoriesState[selectedTab][i - 1].slides,
        hasMore: subCategoriesState[selectedTab][i - 1].slides_count > subCategoriesState[selectedTab][i - 1].slides.length ? true : false,
        part: Math.ceil(subCategoriesState[selectedTab][i - 1].slides.length / 56)
      })
    } else {
      setSelectedSubTab({
        barStyle: selectedSubTab.barStyle,
        tab: 0
      })
      setScrollState({
        items: initialSlides[selectedTab - 1],
        hasMore: categoriesState[selectedTab - 1].slides_count > 56 ? true : false,
        part: 1
      })
    }
  }
  const context = {
    endpoint: endpoint,
    slidesCountState: slidesCountState,
    setSlidesCountState: setSlidesCountState,
    initialSlides: initialSlides,
    setInitialSlides: setInitialSlides,
    scrollState: scrollState,
    setScrollState: setScrollState,
    categoriesState: categoriesState,
    setCategoriesState: setCategoriesState,
    subCategoriesState: subCategoriesState,
    setSubCategoriesState: setSubCategoriesState,
    selectedTab: selectedTab,
    setSelectedTab: setSelectedTab,
    selectedSubTab: selectedSubTab,
    setSelectedSubTab: setSelectedSubTab,
    handleCategoryChange: handleCategoryChange,
    handleSubCategoryChange: handleSubCategoryChange
  }
  
  return (
    <Router>
      <div className="App">
        <Header
          {...context}
        />
        <Switch>
          <Route exact path="/" render={() => <SlideList {...context} />} />
          <Route exact path="/cart" render={() => <Cart {...context} />} />
        </Switch>
        <MUICookieConsent 
          cookieName="sas-cookies"
          componentType="Snackbar"
          message="This website uses cookies for functional and analytical purposes. Please refer to privacy policy to learn more."
        />
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

serviceWorker.unregister()
