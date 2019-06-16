import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './App.css'
import MainPage from '../MainPage'
import AdminPage from '../AdminPage'
import BarbershopPage from '../BarbershopPage';
import { Navbar, Form, Button } from 'react-bootstrap';

class App extends Component {
  render() {
    return ( 
      <div className='app-wrapper'>
        <Navbar className='app__navbar justify-content-between'>
          <Navbar.Brand href='/'><span role='img' aria-label='barber-pole'>💈</span> Freshest Cuts</Navbar.Brand>
          <Form inline>
            <Button variant="outline-primary">Contact Us</Button>
          </Form>
        </Navbar>
        <Router>
          <Route path='/' exact render={() => (
            <MainPage />
          )}/>
          <Route path='/admin' exact render={() => (
            <AdminPage />
          )}/>
          <Route path='/barbershops/:barbershopId' exact render={props => {
            const barbershopId = props.match.params.barbershopId
            return (
              <BarbershopPage 
                barbershopId={barbershopId}
              />
            )
          }}/>
        </Router>
      </div>
    )
  } 
}

export default App;
