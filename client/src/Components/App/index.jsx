import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import MainPage from '../MainPage'
import AdminPage from '../AdminPage'
import BarbershopPage from '../BarbershopPage';
import BarbershopHelper from '../../lib/BarbershopHelper';

class App extends Component {
  render() {
    return ( 
      <div className='app-wrapper'>
        <Router>
          <Route path='/' exact render={() => (
            <MainPage />
          )}/>
          <Route path='/admin' exact render={() => (
            <AdminPage />
          )}/>
          <Route path='/barbershops/:barbershopId' exact render={props => {
            const barbershopId = props.match.params.barbershopId
            BarbershopHelper.getBarbershopById(barbershopId, barbershop => (
              <BarbershopPage 
                barbershop={barbershop}
              />
            ))
          }}/>
        </Router>
      </div>
    )
  } 
}

export default App;
