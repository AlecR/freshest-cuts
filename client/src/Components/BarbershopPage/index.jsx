import React, { Component } from 'react';
import './BarbershopPage.css';
import { withRouter } from 'react-router-dom';
import BarbershopHelper from '../../lib/BarbershopHelper';

class BarbershopPage extends Component {

  state = {
    barbershop: null,
  }

  componentDidMount() {
    const barbershopId = this.props.match.params.barbershopId
    BarbershopHelper.getBarbershopById(barbershopId, barbershop => {
      this.setState({
        barbershop
      })
    })
  }

  render() {
    const barbershopId = this.props.match.params.barbershopId
    return(
      <div>
        {this.state.barbershop ? (
          <h1>This is a page for {this.state.barbershop.name}</h1>
        ) : null}
        <p>Barbershop ID: {barbershopId}</p>
      </div>
    ) 
  }
}

export default withRouter(BarbershopPage)
