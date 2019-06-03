import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import MainPage from '../MainPage'
import AdminPage from '../AdminPage'

class App extends Component {

  render() {
    return ( 
      <div className='app-wrapper'>
        <Router>
          <Route path='/' exact render={() => (
            <MainPage />
          )} />
          <Route path='/admin' exact render={() => (
            <AdminPage />
          )} />
        </Router>
      </div>
    )
  }
  
}


export default App;
