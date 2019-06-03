import React from 'react'
import './FilterButton.css'

const FilterButton = props => (
  <button
    className={`filter-button filter-button__${props.active ? 'active' : 'inactive'}`}
    onClick={() => props.handleClick()}
  >{props.text}</button>
) 

export default FilterButton