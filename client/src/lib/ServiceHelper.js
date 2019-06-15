import { SERVER_ADDRESS } from './Constants'

const getServices = callback => {
  const requestUrl = `${SERVER_ADDRESS}/api/services`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(services => {
    if (services.length > 0) {
      const formattedServices = services.map(service => ({
        id: service.id,
        barbershopId: service.barbershop_id,
        name: service.name,
        description: service.description,
        price: service.price,
      }))
      callback(formattedServices)
    } else {
      callback([])
    }
  }).catch(error => {
    console.log(error)
    callback([])
  })
}

export default { getServices }