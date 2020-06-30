import React from "react"
import ReactDOM from "react-dom"
import "./App.css"
import * as serviceWorker from "./serviceWorker"
import Header from "./components/Header"
import SlideList from "./components/SlideList"
import MUICookieConsent from 'material-ui-cookie-consent'

function App() {
  if (!navigator.cookieEnabled) {
    alert("Cookies must be enabled to use this website!")
    window.location = "/"
  }
  return (
    <div className="App">
      <Header />
      <SlideList />
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
