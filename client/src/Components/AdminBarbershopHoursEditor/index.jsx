import React, { Component} from 'react'
import { SERVER_ADDRESS } from '../../lib/Constants.js'

class AdminBarbershopHoursEditor extends Component {

  state = {
    barbershops: this.props.barbershops,
    selectedBarbershopId: -1,
  }

  onSelectChange = e => {
    const selectedBarbershopId = parseInt(e.target.value)
    this.setState(prevState => ({
      ...prevState,
      selectedBarbershopId
    }))
  }

  onSubmit = e => {
    e.preventDefault()
    const elements = e.target.elements

    const barbershopId = elements[0].value
    const open = elements[1].checked
    const day = elements[2].value
    const openTimeHours = elements[3].value
    var openTimeMinutes = elements[4].value
    const closeTimeHours = elements[5].value
    var closeTimeMinutes = elements[6].value

    var openTime, closeTime = null

    if (open) {
      if (parseInt(openTimeMinutes) < 10) {
        openTimeMinutes = `0${openTimeMinutes}`
      }

      if (closeTimeMinutes < 10) {
        closeTimeMinutes = `0${closeTimeMinutes}`
      }
      openTime = `${openTimeHours}:${openTimeMinutes}`
      closeTime = `${closeTimeHours}:${closeTimeMinutes}`
    }

    const formData = {
      barbershopId,
      day,
      open,
      openTime,
      closeTime
    }
    const requestUrl = `${SERVER_ADDRESS}/api/hours`
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData })
    }).then(response => {
      return response.json()
    }).then(json => {
      console.log(json)
      this.props.updateHoursTable()
    })
  
  }

  componentDidMount() {
    let selectedBarbershopId = -1
    if (this.state.barbershops.length > 0) {
      selectedBarbershopId = this.state.barbershops[0].id
    }
    this.setState(prevState => ({
      ...prevState,
      selectedBarbershopId
    }))
  }
  
  render() {
    const daysOptions = Array.from(Array(7).keys())
    const hoursOptions = Array.from(Array(24).keys())
    const minutesOptions = Array.from(Array(60).keys())
    const barbershop = this.state.barbershops.find(barbershop => {
      return barbershop.id === this.state.selectedBarbershopId
    })
    if (barbershop === undefined || this.state.barbershops.length < 1) { return (
      <div>
        <label>Barbershop: </label>
        <select onChange={e => this.onSelectChange(e)}>
          {this.state.barbershops.map(barbershop => (
            <option value={barbershop.id} key={`${barbershop.name}-option`}>{barbershop.name}</option>
          ))}
        </select>
        <p>🚨 Unable to fetch barbershop information</p> 
      </div>
    )}

    return (
      <div className='admin-page__hours-editor'>
        <h1>Set Hours</h1>
        <form onSubmit={this.onSubmit}>
          <label>Barbershop: </label>
          <select onChange={e => this.onSelectChange(e)}>
            {this.state.barbershops.map(barbershop => (
              <option 
                value={barbershop.id} 
                key={`${barbershop.name}-option`}
              >{barbershop.id} - {barbershop.name}</option>
            ))}
          </select>
          <div className='admin-page__hours-editor-row'>
            <label>Open: </label>
            <input type='checkbox' name='open' />
            <br />
            <label>Day: </label>
            <select>
              {daysOptions.map(dayOption => (
                <option
                  value={dayOption}
                  key={`day-option-${dayOption}`}
                >{dayOption}</option>
              ))}
            </select>
            <br />
            <label>Time: </label>
            <select>
              {hoursOptions.map(hourOption => (
                <option 
                  value={hourOption} 
                  key={`open-hour-option-${hourOption}`}
                >{hourOption}</option>))}
            </select>
            <select>
              {minutesOptions.map(minuteOption => (
                <option 
                  value={minuteOption} 
                  key={`open-minute-option-${minuteOption}`}
                >{minuteOption}</option>))}
            </select>
            <span> - </span>
            <select>
              {hoursOptions.map(hourOption => (
                <option 
                  value={hourOption} 
                  key={`close-hour-option-${hourOption}`}
                >{hourOption}</option>))}
            </select>
            <select>
              {minutesOptions.map(minuteOption => (
                <option 
                  value={minuteOption} 
                  key={`close-hour-option-${minuteOption}`}
                >{minuteOption}</option>))}
            </select>
          </div>
          <button type='submit'>Submit</button>
        </form>
      </div>
    )
  }
}

export default AdminBarbershopHoursEditor