import { SERVER_ADDRESS } from './Constants'
import ServiceHelper from './ServiceHelper'
import BusinessHoursHelper from './BusinessHoursHelper'

const formatBarbershopFromDatabase = barbershopData => {
  return {
    id: barbershopData.id,
    name: barbershopData.name,
    address: barbershopData.address,
    latitude: barbershopData.latitude,
    longitude: barbershopData.longitude,
    phoneNumber: barbershopData.phone_number,
    websiteAddress: barbershopData.website_address,
    appointmentSchedulingAddress: barbershopData.appointment_scheduling_address,
    cashOnly: barbershopData.cash_only,
    priceLevel: barbershopData.price_level,
    services: [],
  }
}

const isOpen = (hours) => {
  const d = new Date()
  const currentHour = d.getHours()
  const currentMinutes =  d.getMinutes()
  const currentDay = d.getDay()

  const hoursToday = hours[currentDay]
  if (!hoursToday.open) {
    return false
  } else {
    const openTimeSplit = hoursToday.openTime.split(':')
    const openTimeHour = openTimeSplit[0]
    const openTimeMinutes = openTimeSplit[1]

    const closeTimeSplit = hoursToday.closeTime.split(':')
    const closeTimeHour = closeTimeSplit[0]
    const closeTimeMinutes = closeTimeSplit[1]

    const openMins = (openTimeHour * 60) + openTimeMinutes
    const closeMins = (closeTimeHour * 60) + closeTimeMinutes
    const currentTimeMins = (currentHour * 60) + currentMinutes

    return currentTimeMins >= openMins && currentTimeMins <= closeMins
  }
}

const getBarbershops = callback => {
  const requestUrl = `${SERVER_ADDRESS}/api/barbershops`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(barbershops => {
    if (barbershops.length > 0) {
      const formattedBarbershops = barbershops.map(barbershop => {
        return formatBarbershopFromDatabase(barbershop)
      })
      BusinessHoursHelper.getHoursForAllBarebershopsById(hours => {
        formattedBarbershops.forEach(barbershop => {
          barbershop.hours = hours[barbershop.id]
          barbershop.isOpen = isOpen(hours[barbershop.id])
        })
        ServiceHelper.getServices(services => {
          services.forEach(service => {
            const barbershop = formattedBarbershops.find(barbershop => barbershop.id === service.barbershopId)
            if (barbershop !== null) {
              barbershop.services.push(service)
            }
          })
          callback(formattedBarbershops)
        })
      })
    } else {
      callback([])
    }
  }).catch(error => {
    console.log(error)
    callback([])
  })
}

const getBarbershopById = (id, callback) => {
  const requestUrl = `${SERVER_ADDRESS}/api/barbershops?barbershopId=${id}`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(barbershopData => {
    if (barbershopData.length < 1) {
      callback(null)
    }
    const barbershop = formatBarbershopFromDatabase(barbershopData[0])
    BusinessHoursHelper.getHoursForBarbershop(id, hours => {
      barbershop.hours = hours
      barbershop.isOpen = isOpen(hours)
      ServiceHelper.getServicesForBarbershop(id, services => {
        barbershop.services = services
        callback(barbershop)
      })
    })
  }).catch(error => {
    console.log(error)
    callback({})
  })
}

const getTravelTimes = (lat, lon, ids, callback) => {
  const requestUrl = `${SERVER_ADDRESS}/api/barbershops/distance?lat=${lat}&lon=${lon}&barbershopIds=${ids}`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(json => {
    callback(json)
  })
}

export default { getBarbershops, getBarbershopById, getTravelTimes }