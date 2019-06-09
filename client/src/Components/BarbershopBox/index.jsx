import React from 'react'
import './BarbershopBox.css'
import Image from '../Image'
import TimeHelper from '../../lib/TimeHelper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCar, faPhone } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'

const BarbershopBox = props => {
  const hoursText = () => {
    const dayOfWeek = new Date().getDay()
    const hours = props.data.hours
    const todayHours = hours[dayOfWeek]
    const openTime = TimeHelper.format24hrs(todayHours.openTime, true)
    const closeTime = TimeHelper.format24hrs(todayHours.closeTime, true)
    if (todayHours.open === false) {
      return 'Closed'
    } else {
      return `Open ${openTime} - ${closeTime}`
    }
  }

  let phoneNumber = null
  if (props.data.phoneNumber) {
    phoneNumber =  props.data.phoneNumber.substr(0,3) + '-' + props.data.phoneNumber.substr(3,3) + '-' +  props.data.phoneNumber.substr(6,4)
  }

  const dollarSignsForPriceLevel = () => {
    const barbershopPriceLevel = props.data.priceLevel
    return (
      <div className='barbershop-box__price-level-wrapper'>
        {[0, 1, 2].map((priceLevel, index) => (
          priceLevel <= barbershopPriceLevel ? (
            <span 
              key={`${props.data.name}-price-box-${index}`}
              className='barbershop-box__price-level barbershop-box__price-level--active'
            >$</span>
          ) : (
            <span
              key={`${props.data.name}-price-box-${index}`} 
              className='barbershop-box__price-level barbershop-box__price-level--inactive'
            >$</span>
          )
        ))}
      </div>
    )
  }

  return (
    <div 
      className='barbershop-box__wrapper'
      onClick={() => props.didClickBarbershopBox(props.data)}
    >
      <div className='barbershop-box__image-wrapper'>
        <Image 
          className='barbershop-box__image' 
          src={`./assets/${props.data.id}.jpg`}
          alt={`${props.data.name}`} 
          backupSrc={'./assets/freshest-cuts-logo.png'}
        />
      </div>
      <div className='barbershop-box__content-wrapper'>
        <div className='barbershop-box__content-top-section'>
          <p className='barbershop-box__name'>{props.data.name}</p>
          {dollarSignsForPriceLevel()}
        </div>
        <p className='barbershop-box__location'>{props.data.address}</p>
        {phoneNumber !== null ? (
          <p className='barbershop-box__phone-number'><FontAwesomeIcon icon={faPhone} /> {phoneNumber}</p>
        ) : null}
        {props.data.travelTime ? (
          <p className='barbershop-box__travel-distance'><FontAwesomeIcon icon={faCar} /> {props.data.travelDistance} miles away</p>
        ) : null}
        {props.data.hours ? (
          <p className='barbershop-box__hours'><FontAwesomeIcon icon={faClock} /> {hoursText()}</p>
        ) : null}
        
      </div>
    </div>
  )
}

export default BarbershopBox;