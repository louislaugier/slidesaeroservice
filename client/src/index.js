import React from "react"
import ReactDOM from "react-dom"
import "./App.css"
import * as serviceWorker from "./serviceWorker"
import Header from "./components/Header"
import SlideList from "./components/SlideList"

function App() {
  return (
    <div className="App">
      <Header />
      <SlideList />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById("root"))

serviceWorker.unregister()
