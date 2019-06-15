import React, { Component } from 'react'
import BarbershopHelper from '../../lib/BarbershopHelper.js'
import ServiceHelper from '../../lib/ServiceHelper.js'
import { SERVER_ADDRESS } from '../../lib/Constants.js'
import AdminBarbershopHoursEditor from '../AdminBarbershopHoursEditor/index.jsx'
import './AdminPage.css'
import BusinessHoursHelper from '../../lib/BusinessHoursHelper.js';

// NOTE: Most of this code is terrible, but it works for an admin page. Modify with caution,
// may be a serious undertaking to unravel whats going on here

const newBarbershopFormData = {
  title: 'New Barbershop',
  fields: [
    {
      type: 'text',
      label: 'Name',
      pgKey: 'name',
    },
    {
      type: 'text',
      label: 'Address',
      pgKey: 'address',
    },
    {
      type: 'text',
      label: 'Website Address',
      pgKey: 'website_address',
    },
    {
      type: 'text',
      label: 'Appointment Scheduling Address',
      pgKey: 'appointment_scheduling_address'
    },
    {
      type: 'checkbox',
      label: 'Cash Only',
      pgKey: 'cash_only'
    },
    {
      type: 'text',
      label: 'Price Level',
      pgKey: 'price_level'
    }
  ]
}

const newServiceFormData = {
  title: 'New Serivce',
  fields: [
    {
      type: 'text',
      label: 'Barbershop ID',
      pgKey: 'barbershop_id',
    },
    {
      type: 'text',
      label: 'Name',
      pgKey: 'name',
    },
    {
      type: 'text',
      label: 'Description',
      pgKey: 'description',
    },
    {
      type: 'text',
      label: 'price',
      pgKey: 'price',
    },
  ]
}

const AdminForm = props => {
  return (
    <form onSubmit={props.onSubmit}>
      <h1>{props.formData.title}</h1>
      {props.formData.fields.map(field => (
        <div key={`${field.pgKey}-input-div`}>
          <label>{field.label}: </label>
          <input type={`${field.type}`} name={`${field.pgKey}`} />
        </div>
      ))}
      <button type='submit'>Submit</button>
    </form>
  )
}

const AdminTable = props => {
  const data = props.data
  if (data == null || data.length < 1) return (<table></table>)
  const firstTableElement = data[0]
  const headers = Object.keys(firstTableElement)
  return (
    <div className='admin-page__table-wrapper'>
      <h1>{props.title}</h1>
      <table className='admin-page__table' border='1'>
        <tbody>
          <tr>
            {headers.map(header => (
              <th key={`${header}-table-header`}>{header}</th>
            ))}
          </tr>
          {data.map((rowData, index) => (
            <tr key={`admin-table-row-${index}`}>
              {headers.map(header => {
                let rowContent = rowData[header]
                if (rowContent === null) {
                  rowContent = null
                } else {
                  rowContent = rowContent.toString()
                }
                return ( <td className='admin-page__table-td' key={`${header}-table-content`}>{rowContent || 'NULL'}</td>)
              })}
              {props.onDeleteButtonClick ? (
                <td>
                  <button 
                    onClick={() => props.onDeleteButtonClick(rowData['id'])}
                  >Delete</button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

class AdminPage extends Component {

  state = {
    barbershops: [],
    services: [],
    hours: [],
    selectedBarbershopHoursId: -1,
  }

  componentDidMount() {
    BarbershopHelper.getBarbershops(barbershops => {
      ServiceHelper.getServices(services => {
        BusinessHoursHelper.getHours(hours => {
          console.log(hours)
          this.setState(prevState => ({
            ...prevState,
            services,
            barbershops,
            hours
          }))
        })
      })
    })
  }

  updateHours = () => {
    BusinessHoursHelper.getHours(hours => {
      this.setState(prevState => ({
        ...prevState,
        hours
      }))
    })
  }
  

  parseFormData = e => {
    e.preventDefault()
    const formValues = {}
    const elements = e.target.elements
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].tagName !== 'INPUT') continue
      switch (elements[i].type) {
        case 'text': formValues[elements[i].name] = elements[i].value; break
        case 'checkbox': formValues[elements[i].name] = elements[i].checked; break
        default: break
      }
    }
    return formValues
  }

  handleNewBarbershopFormSubmit = e => {
    e.preventDefault()
    const formData = this.parseFormData(e)
    const requestUrl = `${SERVER_ADDRESS}/api/barbershops`
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
      BarbershopHelper.getBarbershops(barbershops => {
        this.setState(prevState => ({
          ...prevState,
          barbershops,
        }))
      })
    })
  }

  handleHoursTableDeleteButtonClick = id => {
    BusinessHoursHelper.deleteHoursById(id, () => {
      BusinessHoursHelper.getHours(hours => {
        this.setState(prevState => ({
          ...prevState,
          hours
        }))
      })
    })
  }

  handleNewServiceFormSubmit = e => {
    e.preventDefault()
    const formData = this.parseFormData(e)
    const requestUrl = `${SERVER_ADDRESS}/api/services`
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ formData })
    }).then(response => {
      return response.json()
    }).then(json => {
      ServiceHelper.getServices(services => {
        this.setState(prevState => ({
          ...prevState,
          services,
        }))
      })
    })
  }

  render() {
    return (
      <div className='admin-page__wrapper'>
        <AdminForm 
          formData={newBarbershopFormData}
          onSubmit={e => this.handleNewBarbershopFormSubmit(e)}
        />
        <AdminTable 
          title='Barbershops'
          data={this.state.barbershops}
        />
        <AdminTable 
          title='Hours'
          data={this.state.hours.sort((b1, b2) => (
            b1.day - b2.day
          )).sort((b1, b2) => b1.barbershop_id - b2.barbershop_id)}
          onDeleteButtonClick={this.handleHoursTableDeleteButtonClick}
        />
        {this.state.barbershops.length > 0 ? (
          <AdminBarbershopHoursEditor
            barbershops={this.state.barbershops}
            updateHoursTable={this.updateHours}
          />
        ) : null }
        <AdminTable
          title='Services' 
          data={this.state.services}
        />
        <AdminForm 
          formData={newServiceFormData}
          onSubmit={e => this.handleNewServiceFormSubmit(e)}
        />
      </div>
    )
  }
}

export default AdminPage