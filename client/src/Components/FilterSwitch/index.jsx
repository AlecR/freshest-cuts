import React, { Component } from 'react'
import './FilterSwitch.css'

class FilterSwitch extends Component {

  render() {
    return (
      <div 
        className='filter-switch__wrapper'
        style={{
          display: 'grid',
          gridTemplateColumns: `${this.props.options.map(_ => '1fr ').join('')}`
        }}
      >
        {this.props.options.map(option => {
          const active = option.value === this.props.activeOptionValue
          return (
            <button 
              className={`filter-switch filter-switch__${active ? 'active' : 'inactive'}`}
              onClick={() => this.props.onOptionSelect(this.props.filterType, option.value)}
            >{option.text}</button>
          )
        })}
      </div>
    )
  }
}

export default FilterSwitch