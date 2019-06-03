import { SERVER_ADDRESS } from './Constants'

const getHours = callback => {
  const requestUrl = `${SERVER_ADDRESS}/hours`
  fetch(requestUrl).then(response => {
    return response.json()
  }).then(hours => {
    callback(hours)
  }).catch(error => {
    console.log(error)
    callback({})
  })
}

const getHoursByBarbershopId = callback => {
  getHours(hours => {
    const hoursByBarbershopId = {}
    hours.forEach(singleDayHours => {
      const dayIndex = singleDayHours.day
      const barbershopId = singleDayHours.barbershopId
      if (hoursByBarbershopId[barbershopId] === undefined) {
        hoursByBarbershopId[barbershopId] = []
      }
      hoursByBarbershopId[barbershopId][dayIndex] = singleDayHours
    })
    callback(hoursByBarbershopId)
  })
}

const deleteHoursById = (id, callback) => {
  const requestUrl = `${SERVER_ADDRESS}/hours?id=${id}`
  fetch(requestUrl, {
    method: 'DELETE',
  }).then(response => {
    return response.json()
  }).then(hours => {
    callback(hours)
  }).catch(error => {
    console.log(error)
    callback({ error })
  })
}



export default { getHours, getHoursByBarbershopId, deleteHoursById }