import React, {useState} from "react"
import ReactDOM from "react-dom"
import "./App.css"
import * as serviceWorker from "./serviceWorker"
import Header from "./components/Header"
import SlideList from "./components/SlideList"
import MUICookieConsent from 'material-ui-cookie-consent'

function App() {
  if (!navigator.cookieEnabled) {
    alert("Cookies must be enabled to use this website.")
    window.location = "/"
  }
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
  
  const props = {
    endpoint: "http://localhost:8080/api/v1",
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
    setSelectedSubTab: setSelectedSubTab
  }
  return (
    <div className="App">
      <Header
        {...props}
      />
      <SlideList
        {...props}
      />
      <MUICookieConsent 
        cookieName="sas-cookies"
        componentType="Snackbar"
        message="This website uses cookies for functional and analytical purposes. Please refer to privacy policy to learn more."
      />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

serviceWorker.unregister()
