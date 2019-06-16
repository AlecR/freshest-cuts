const express = require('express');
const db = require('../db/index.js');
const fetch = require('node-fetch');
const Logger = require('../lib/Logger');
const router = express.Router();
const logger = new Logger('💈');

router.get('/', (req, res) => {
  let barbershopQuery = 'select * from barbershops'
  if (req.query.barbershopId) {
    barbershopQuery += ` WHERE id = ${req.query.barbershopId}` 
  }
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      logger.error(error)
      res.send({ error })
    } else {
      logger.success(`GET ${req.originalUrl}`)
      res.send(result.rows)
    }
  })
})

router.post('/', (req, res) => {
  const {name, address, website_address, apppointment_scheduling_address, 
         cash_only, price_level} = req.body.formData
  const barbershopQuery = `
    INSERT INTO barbershops 
	  (name, address, website_address, appointment_scheduling_address, cash_only, price_level)
	  VALUES
    ('${name}', '${address}',  '${website_address}', '${apppointment_scheduling_address}', ${cash_only}, ${price_level});`
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      logger.error(`POST ${req.originalUrl}: ${error}`)
      res.send({ error })
    } else {
      logger.success(`POST ${req.originalUrl}`)
      res.send(result) 
    }
  })
})

router.get('/distance', (req, res) => {
  // TODO: Reset this key and hide the new one before deplyoing to prod
  const key = 'AIzaSyBSZp93QBZgVxXWSkMZiJpGGFyu1H4VOZk'
  const lat = req.query.lat
  const lon = req.query.lon
  const barbershopIds = req.query.barbershopIds
  const addressQuery = `select barbershops.address from barbershops where id in (${barbershopIds})`
  db.query(addressQuery, (error, result) => {
    if (error) {
      logger.error(`GET /barbershops/distance: ${error}`)
      res.send({ error })
    } else {
      const destinations = result.rows.map(row => row.address.split(' ').join('+')).join('|')
      const distanceRequestUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${lat},${lon}&destinations=${destinations}&key=${key}`
      fetch(distanceRequestUrl, {
        method: 'GET',
        'Content-Type': 'application/json',
      }).then(response => {
        return response.json()
      }).then(json => {
        let addresses = json.destination_addresses
        const travelTimes = json.rows[0].elements
        const ids = barbershopIds.split(',')
        const result = addresses.map((address, index) => {
          let travelDistance = travelTimes[index].distance.text.split(' ')[0]
          if (travelDistance.includes('.0')) {
            travelDistance = parseInt(travelDistance)
          } else {
            travelDistance = parseFloat(travelDistance)
          }
          let travelTime= travelTimes[index].duration.text.split(' ')[0]
          travelTime = parseInt(travelTime)

          return {
            id: parseInt(ids[index]),
            address,
            travelDistance,
            travelTime,
          }
        })
        logger.success(`GET ${req.originalUrl}`)
        res.send(result)
      }).catch(err => {
        logger.error(`GET ${req.originalUrl}: ${err}`)
        res.send(err)
      })
    }
  })
})

module.exports = router