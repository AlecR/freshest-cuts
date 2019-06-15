import React, { Component } from 'react';
import './BarbershopPage.css';
import { withRouter } from 'react-router-dom';

class BarbershopPage extends Component {
  render() {
    const barbershopId = this.props.match.params.barbershopId
    return(
      <div>
        <h1>Hello World - BarbershopPage component</h1>
        <p>Barbershop ID: {barbershopId}</p>
      </div>
    ) 
  }
}

export default withRouter(BarbershopPage)
