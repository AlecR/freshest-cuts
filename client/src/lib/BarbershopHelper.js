import { SERVER_ADDRESS } from './Constants'
import ServiceHelper from './ServiceHelper'
import BusinessHoursHelper from './BusinessHoursHelper'

const getBarbershops = callback => {
  const requestUrl = `${SERVER_ADDRESS}/barbershops`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(barbershops => {
    if (barbershops.length > 0) {
      const formattedBarbershops = barbershops.map(barbershop => ({
        id: barbershop.id,
        name: barbershop.name,
        address: barbershop.address,
        phoneNumber: barbershop.phone_number,
        websiteAddress: barbershop.website_address,
        appointmentSchedulingAddress: barbershop.appointment_scheduling_address,
        cashOnly: barbershop.cash_only,
        priceLevel: barbershop.price_level,
        services: [],
      }))
      BusinessHoursHelper.getHoursByBarbershopId(hours => {
        console.log(hours)
        formattedBarbershops.forEach(barbershop => {
          barbershop.hours = hours[barbershop.id]
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

const getTravelTimes = (lat, lon, ids, callback) => {
  const requestUrl = `${SERVER_ADDRESS}/barbershops/distance?lat=${lat}&lon=${lon}&barbershopIds=${ids}`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(json => {
    callback(json)
  })
}

export default { getBarbershops, getTravelTimes }