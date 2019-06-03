import React from 'react';
import './BarbershopModal.css';
import Modal from 'react-modal'
import Image from '../Image'
import TimeHelper from '../../lib/TimeHelper'

const BarbershopModal = props => {
  const customStyles = {
    content : {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '10px',
      width: '900px',
      height: '500px',
      overflow: 'none',
      display: 'grid',
      gridTemplateRows: '50px auto',
      padding: '10px',
    }
  }

  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  console.log(props.barbershop)
  return (
    <Modal
      isOpen={props.isOpen}
      style={customStyles}
      onRequestClose={() => props.didCloseModal()}
    >
      <section className='barbershop-modal__top-section'>
        <p className='barbershop-modal__name'>{props.barbershop.name}</p>
      </section>
      <section className='barbershop-modal__content-section'>
        <div className='barbershop-modal__left-side'>
          <div className='barbershop-modal__image-wrapper'>
            <Image 
              className='barbershop-modal__image' 
              src={`./assets/${props.barbershop.id}.jpg`}
              alt={`${props.barbershop.name}`} 
              backupSrc={'./assets/freshest-cuts-logo.png'}
            />
          </div>
          <div className='barbershop-modal__left-side-footer'>
            <div className='barbershop-modal__footer-button-wrapper'>
            {props.barbershop.websiteAddress ? (
              <a 
                className='barbershop-modal__footer-button'
                href={props.barbershop.websiteAddress}
                target='_blank'
                rel='noopener noreferrer'
              >Website</a>
            ) : (null)}
            </div>
            <div className='barbershop-modal__footer-button-wrapper'>
            {props.barbershop.appointmentSchedulingAddress ? (
              <a 
                className='barbershop-modal__footer-button'
                href={props.barbershop.appointmentSchedulingAddress}
                target='_blank'
                rel='noopener noreferrer'
              >Schedule an Appointment</a>
            ) : (null)}
            </div>
          </div>
        </div>
        <div className='barbershop-modal__right-side'>
          <table className='barbershop-modal__hours-table'>
            <caption className='barbershop-modal__table-title' align="top">Hours</caption>
            <tbody>
              {props.barbershop.hours.map((dayHours, index) => {
                const openTime = TimeHelper.format24hrs(dayHours.openTime, true)
                const closeTime = TimeHelper.format24hrs(dayHours.closeTime, true)
                return (
                  <tr
                    key={`${days[index]}-hours`}
                  > 
                    <td className='barbershop-modal__hours-table-day'>{days[index]}</td>
                    <td className='barbershop-modal__hours-table-hours'>
                      {dayHours.open ? (
                      `${openTime} - ${closeTime}`
                      ) : 'Closed today'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <table className='barbershop-modal__services-table'>
            <caption className='barbershop-modal__table-title' align="top">Services</caption>
            <tbody>
              {props.barbershop.services.map((service, index) => {
                return (
                  <tr
                    key={`${service.name}-service`}
                  > 
                    <td className='barbershop-modal__services-table-name'>{service.name}</td>
                    <td className='barbershop-modal__services-table-price'>${service.price}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
      
    </Modal>
  )
}

export default BarbershopModal