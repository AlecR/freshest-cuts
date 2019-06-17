import React, { Component } from 'react';
import './BarbershopPage.css';
import { withRouter } from 'react-router-dom';
import BarbershopHelper from '../../lib/BarbershopHelper';
import BarbershopMap from '../BarbershopMap';
import { Table } from 'react-bootstrap';
import { formatTimeTo12Hours, formatPhoneNumber } from '../../lib/FormattingUtil'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faCircle } from '@fortawesome/free-solid-svg-icons'

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
              <div className='barbershop-page__top-row-box'>
                <p className='barbershop-page__box-name'>{this.state.barbershop.name}</p>
                <p className='barbershop-page__open-indicator'>
                  {this.state.barbershop.isOpen ? (
                    <React.Fragment>
                      <FontAwesomeIcon icon={faCircle} className='barbershop-page__open-indicator-icon--green' /> Open
                    </React.Fragment>
                    
                  ) : (
                    <React.Fragment>
                      <FontAwesomeIcon icon={faCircle} className='barbershop-page__open-indicator-icon--red' /> Closed
                    </React.Fragment>
                  )}
                </p>
                <p className='barbershop-page__box-phone-number'>
                  <FontAwesomeIcon icon={faPhone} />{formatPhoneNumber(this.state.barbershop.phoneNumber)}
                </p>
              </div>
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
            <div className='barbershop-page__services-wrapper'>
              <ServicesTable
                services={this.state.barbershop.services}
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
  if (props.hours && props.hours.length < 1) {
    return null
  }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const d = new Date()
  const today = d.getDay()
  return (
    <React.Fragment>
      <p className='barbershop-page__hours-table-title'>Hours</p>
      <Table>
        <tbody>
          {props.hours.map((dayHours, index) => {
            const openTime = formatTimeTo12Hours(dayHours.openTime, true)
            const closeTime = formatTimeTo12Hours(dayHours.closeTime, true)
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
        </tbody>
      </Table>
    </React.Fragment>
  )
}

const ServicesTable = props => {
  if (props.services && props.services.length < 1) {
    return null 
  }
  return (
    <React.Fragment>
      <p className='barbershop-page__services-table-title'>Services</p>
      <Table>
        <tbody>
          {props.services.map((service, index) => {
            return (
              <tr
                key={`serivce-${index}`}
              > 
                <td className='barbershop-page__services-table-day'>{service.name}</td>
                <td className='barbershop-page__services-table-hours'>{service.price}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </React.Fragment>
  )
}

export default withRouter(BarbershopPage)
