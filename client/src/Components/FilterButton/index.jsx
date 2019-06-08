import React from 'react'
import { Button } from 'react-bootstrap'
import './FilterButton.css'

const FilterButton = props => (
  <Button
    className={`filter-button filter-button__${props.active ? 'active' : 'inactive'}`}
    onClick={() => props.handleClick()}
  >{props.text}</Button>
) 

export default FilterButton