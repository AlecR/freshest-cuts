import React, { Component } from 'react';
import './BarbershopPage.css';
import { withRouter } from 'react-router-dom';
import BarbershopHelper from '../../lib/BarbershopHelper';
import BarbershopMap from '../BarbershopMap';
import { Table } from 'react-bootstrap';
import TimeHelper from '../../lib/TimeHelper';

class BarbershopPage extends Component {

  state = {
    loadedData: false,
    barbershop: null,
  }

  componentDidMount() {
    const barbershopId = this.props.match.params.barbershopId
    BarbershopHelper.getBarbershopById(barbershopId, barbershop => {
      this.setState({
        barbershop,
        loadedData: true
      })
    })
  }

  render() {
    return (
      <div className='barbershop-page__wrapper'>
        {this.state.loadedData ? (
          <React.Fragment>
            <div className='barbershop-page__top-row'>
              <p className='barbershop-page__name'>{this.state.barbershop.name}</p>
            </div>
            <div className='barbershop-box__images-wrapper'>

            </div>
            <div className='barbershop-page__location-wrapper'>
              <BarbershopMap 
                latitude={this.state.barbershop.latitude}
                longitude={this.state.barbershop.longitude}
              />
              <p className='barbershop-page__location-text'>{this.state.barbershop.address}</p>
              <a 
                className='barbershop-page__location-link' 
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURI(this.state.barbershop.address)}`}
              >Get directions</a>
            </div> 
            <div className='barbershop-page__hours-wrapper'>
              <HoursTable
                hours={this.state.barbershop.hours}
              />
            </div>
          </React.Fragment>
        ) : (
          <div className='barbershop-page__loading-wrapper'>
            <span 
              className='barbershop-page__loading-icon' 
              role='img' 
              aria-label='shrugging-person'
            >💇🏼‍♂️</span>
            <p className='barbershop-page__loading-text'>Opening up the barbershop...</p>
          </div>
        )}
      </div>      
    ) 
  }
}

const HoursTable = props => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const d = new Date()
  const today = d.getDay()
  return (
    <React.Fragment>
      <p className='barbershop-page__hours-table-title'>Hours</p>
      <Table>
        {props.hours.map((dayHours, index) => {
          const openTime = TimeHelper.format24hrs(dayHours.openTime, true)
          const closeTime = TimeHelper.format24hrs(dayHours.closeTime, true)
          return (
            <tr
              key={`${days[index]}-hours`}
              className={index === today ? 'barbershop-page__hours-table-row-today' : ''}
            > 
              <td className='barbershop-page__hours-table-day'>{days[index]}</td>
              <td className='barbershop-page__hours-table-hours'>
                {dayHours.open ? (
                `${openTime} - ${closeTime}`
                ) : 'Closed today'}
              </td>
            </tr>
          )
        })}
      </Table>
    </React.Fragment>
    
  )
}

export default withRouter(BarbershopPage)
