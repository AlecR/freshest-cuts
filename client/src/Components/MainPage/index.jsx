import React, { Component } from 'react'
import './MainPage.css'
import BarbershopBox from '../BarbershopBox'
import BarbershopModal from '../BarershopModal'
import BarbershopHelper from '../../lib/BarbershopHelper'
import FilterButton from '../FilterButton'
import FilterSwitch from '../FilterSwitch'
import Fuse from 'fuse.js'
import { ButtonGroup, Button, FormControl, Form, Navbar } from 'react-bootstrap'

class MainPage extends Component {

  Filters = {
    ACCEPTS_CREDIT: 'acceptsCredit',
    ONLINE_SCHEDULING: 'onlineScheduling',
    OPEN_TODAY: 'openToday',
    PRICE_LEVEL: 'priceLevel',
    TRAVEL_DISTANCE: 'travelDistance',
  }

  Sorts = {
    NONE: 'none',
    DISTANCE_CLOSEST: 'distanceClosest',
    DISTANCE_FURTHEST: 'distanceFurthest',
    PRICE_LEVEL_LOWEST: 'priceLevelLowest',
    PRICE_LEVEL_HIGHEST: 'priceLevelHighest',
  }

  filterType = {
    BUTTON: 'button',
    SWITCH: 'switch',
  }

  state = {
    barbershops: [],
    selectedBarbershop: null,
    loadedBarbershops: false,
    filtering: false,
    searchBarInput: '',
    sortByOption: null,
    filters: { 
      acceptsCredit: false,
      onlineScheduling: false,
      openToday: false,
      priceLevel: null,
      travelDistance: null,
    }
  }

  filterButtonData = [
    {
      type: this.filterType.BUTTON,
      text: '💳 Accepts Credit / Debit',
      filterPropertyName: this.Filters.ACCEPTS_CREDIT
    },
    {
      type: this.filterType.BUTTON,  
      text: '👨🏼‍💻 Schedule Online',
      filterPropertyName: this.Filters.ONLINE_SCHEDULING
    },
    {
      type: this.filterType.BUTTON,
      text: '🗓 Open Today',
      filterPropertyName: this.Filters.OPEN_TODAY
    },
    {
      type: this.filterType.SWITCH,
      title: '💵 Price Level',
      options: [
        {
          text: '$',
          value: 0,
        },
        {
          text: '$$',
          value: 1,
        },
        {
          text: '$$$',
          value: 2,
        },
      ],
      filterPropertyName: this.Filters.PRICE_LEVEL
    },
    {
      type: this.filterType.SWITCH,
      title: '🚗 Travel Distance',
      options: [
        {
          text: '1 Mi.',
          value: 1,
        },
        {
          text: '3 Mi.',
          value: 3,
        },
        {
          text: '5 Mi.',
          value: 5
        },
      ],
      filterPropertyName: this.Filters.TRAVEL_DISTANCE
    }
  ]

  sortBarbershops = barbershops => {
    switch (this.state.sortByOption) {
      case this.Sorts.DISTANCE_CLOSEST: 
        barbershops = barbershops.sort((b1, b2) => {
          return b1.travelDistance - b2.travelDistance
        })
        break;
      case this.Sorts.DISTANCE_FURTHEST: 
        barbershops = barbershops.sort((b1, b2) => {
          return b2.travelDistance - b1.travelDistance
        })
        break;
      case this.Sorts.PRICE_LEVEL_HIGHEST: 
        barbershops = barbershops.sort((b1, b2) => {
          return b2.priceLevel - b1.priceLevel
        })
        break;
      case this.Sorts.PRICE_LEVEL_LOWEST: 
        barbershops = barbershops.sort((b1, b2) => {
          return b1.priceLevel - b2.priceLevel
        })
        break;
      default: break;
    }
    return barbershops
  }

  filterBarbershops = () => {
    let barbershops = this.state.barbershops
    const filters = this.state.filters
    Object.keys(filters).forEach(filterKey => {
      if (filters[filterKey] !== false && filters[filterKey] !== null) {
        switch (filterKey) {
          case this.Filters.ACCEPTS_CREDIT:
            barbershops = barbershops.filter(barbershop => 
              barbershop.cashOnly === false
            )
            break
          case this.Filters.ONLINE_SCHEDULING:
            barbershops = barbershops.filter(barbershop => 
              barbershop.appointmentSchedulingAddress !== null  
            )
            break
          case this.Filters.OPEN_TODAY:
            barbershops = barbershops.filter(barbershop => {
              const todayIndex = new Date().getDay()
              return barbershop.hours[todayIndex].open
            })
            break
            case this.Filters.PRICE_LEVEL:
              const filteringPriceLevel = this.state.filters.priceLevel
              barbershops = barbershops.filter(barbershop => {
                return barbershop.priceLevel === filteringPriceLevel
              })
              break
            case this.Filters.TRAVEL_DISTANCE:
              const maxDistance = this.state.filters.travelDistance
              barbershops = barbershops.filter(barbershop => {
                return barbershop.travelDistance <= maxDistance
              })
              break
          default : break
        }
      }
    })

    const options = {
      keys: [{
        name: 'name',
        weight: 0.5
      }, {
        name: 'address',
        weight: 0.5
      }]
    }

    if (this.state.searchBarInput !== '') {
      const fuse = new Fuse(barbershops, options)
      barbershops = fuse.search(this.state.searchBarInput)
    }
    this.sortBarbershops(barbershops)
    return barbershops;
  }

  componentDidMount() {
    BarbershopHelper.getBarbershops(barbershops => {
      this.setState(prevState => ({
        ...prevState,
        barbershops,
        loadedBarbershops: true,
      }), this.calculateDistancesForBarbershops())
    })
  }

  calculateDistancesForBarbershops = () => {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude
      const lon = pos.coords.longitude
      const ids = this.state.barbershops.map(barbershop => barbershop.id )
      BarbershopHelper.getTravelTimes(lat, lon, ids, travelData => {
        const barbershopsWithTravelTimes = this.state.barbershops.map(barbershop => {
          const travelDataForBarbershop = travelData.find(t => t.id === barbershop.id)
          if (travelDataForBarbershop !== undefined) {
            return {
              ...barbershop,
              travelTime: travelDataForBarbershop.travelTime,
              travelDistance: travelDataForBarbershop.travelDistance
            }
          } else {
            return { ...barbershop }
          }
          
        })
        this.setState(prevState => ({
          ...prevState,
          barbershops: barbershopsWithTravelTimes
        }))
      })
    });
  }

  toggleFilter = filterName => {
    const filters = this.state.filters
    filters[filterName] = !filters[filterName]
    this.setState(prevState => ({
      ...prevState,
      filters
    }))
  }

  setSwitchFilterValue = (filterName, value) => {
    const filters = this.state.filters
    if (value === filters[filterName]) {
      filters[filterName] = null
    } else {
      filters[filterName] = value
    }
    this.setState(prevState => ({
      ...prevState,
      filters
    }))
  }

  didSelectBarbershop = selectedBarbershop => {
    this.setState(prevState => ({
      ...prevState,
      selectedBarbershop
    }))
  }

  closeModal = () => {
    this.setState(prevState => ({
      ...prevState,
      selectedBarbershop: null
    }))
  }

  handleSearchBarChange = e => {
    const searchBarInput = e.target.value
    this.setState(prevState => ({
      ...prevState,
      searchBarInput
    }))
  }

  handleSortSelectChange = e => {
    const optionValue = e.target.value
    console.log(optionValue)
    this.setState(prevState => ({
      ...prevState,
      sortByOption: optionValue
    }))
  }

  render() {
    const filteredBarbershops = this.filterBarbershops()
    return (
      <div className="main-page__wrapper">
        <Navbar className='main-page__header justify-content-between'>
          <Navbar.Brand>💈 Freshest Cuts</Navbar.Brand>
          <Form inline>
            <Button variant="outline-primary">Contact Us</Button>
          </Form>
        </Navbar>
        <section className='main-page__content'>
          <div className='main-page__sidebar'>
            <p className='main-page__sidebar-title'>Filter Barbershops</p>
            <ButtonGroup 
              vertical
              className='main-page__filter-button-group'
            >
            {this.filterButtonData.map((buttonData, index) => {
              let filterItem = null
              switch (buttonData.type) {
                case this.filterType.BUTTON: filterItem = (
                  <FilterButton
                    key={`filter-button-${index}`}
                    text={buttonData.text}
                    active={this.state.filters[buttonData.filterPropertyName]}
                    handleClick={() => this.toggleFilter(buttonData.filterPropertyName)}
                  />
                )
                break
                case this.filterType.SWITCH: filterItem = (
                  <FilterSwitch 
                    key={`filter-switch-${index}`}
                    filterType={buttonData.filterPropertyName}
                    activeOptionValue={this.state.filters[buttonData.filterPropertyName]}
                    onOptionSelect={this.setSwitchFilterValue}
                    options={buttonData.options}
                  />
                )
                break
                default: return (<p>Invalid filter type</p>)
              }
              return (
                <div className='main-page__sidebar-filter-item'>
                  {filterItem}
                </div>
              )
            })}
            </ButtonGroup>
          </div>
          <div className='main-page__main-content-wrapper'>
            <Form className='main-page__search-bar-wrapper'>
              <FormControl 
                type='text'
                className='main-page__search-bar'
                placeholder='Search'
                value={this.state.searchBarInput} 
                onChange={e => this.handleSearchBarChange(e)}
              />
              <FormControl
                as='select'
                className='main-page__sort-select'
                placeholder='Search'
                value={this.state.sortByOption} 
                onChange={e => this.handleSortSelectChange(e)}
              >
                <option selected value={null}>Sort By...</option>
                <option value={this.Sorts.DISTANCE_CLOSEST}>Distance (Closest)</option>
                <option value={this.Sorts.DISTANCE_FURTHEST}>Distance (Furthest)</option>
                <option value={this.Sorts.PRICE_LEVEL_LOWEST}>Cost (Cheapest)</option>
                <option value={this.Sorts.PRICE_LEVEL_HIGHEST}>Cost (Most Expensive)</option>
              </FormControl>
            </Form>
            <div className='main-page__barbershop-boxes-wrapper'>
              {this.state.loadedBarbershops ? (
                filteredBarbershops.length > 0 ? (
                  filteredBarbershops.map((barbershop, index) => (
                    <BarbershopBox 
                      key={`barbershop-${index}`}
                      data={barbershop}
                      didClickBarbershopBox={this.didSelectBarbershop}
                    />
                  ))) : (
                    <div className='main-page__no-results-wrapper'>
                      <p className='main-page__no-results-icon'>🤷🏼‍♂️</p>
                      <p className='main-page__no-results-text'>No barbershops match your search</p>
                    </div>
                  )
              ) : (
                <div className='main-page__loading-indicator'>
                  <p className='main-page__loading-indicator-icon'>💈</p>
                  <p className='main-page__loading-indicator-text'>Loading Barbershops...</p>
                </div>
              )}
            </div>
          </div>
          {this.state.selectedBarbershop ? (
            <BarbershopModal 
              isOpen={this.state.selectedBarbershop !== null}
              barbershop={this.state.selectedBarbershop}
              didCloseModal={this.closeModal}
            />
          ) : null}
        </section>
      </div>
    )
  }

}

export default MainPage;