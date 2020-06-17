import React from 'react'
import ReactDOM from 'react-dom'
import './App.css'
import * as serviceWorker from './serviceWorker'

class App extends React.Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  render(){
    return (
      <div className='App'>
        <header className='App-header'>
          Header
        </header>
        Page
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

serviceWorker.unregister()
