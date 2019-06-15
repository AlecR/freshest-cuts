import { SERVER_ADDRESS } from './Constants'

const formatServicesFromDatabase = servicesData => {
  if (servicesData.length < 1) {
    return []
  } else {
    return servicesData.map(serviceData => {
      return {
        id: serviceData.id,
        barbershopId: serviceData.barbershop_id,
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
      }
    })
  }
}

const getServices = callback => {
  const requestUrl = `${SERVER_ADDRESS}/api/services`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(services => {
    const formattedServices = formatServicesFromDatabase(services)
    callback(formattedServices)
  }).catch(error => {
    console.log(error)
    callback([])
  })
}

const getServicesForBarbershop = (barbershopId, callback) => {
  const requestUrl = `${SERVER_ADDRESS}/api/services?barbershopId=${barbershopId}`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(services => {
    const formattedServices = formatServicesFromDatabase(services)
    callback(formattedServices)
  }).catch(error => {
    console.log(error)
    callback([])
  })
}

export default { getServices, getServicesForBarbershop }