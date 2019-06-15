const express = require('express');
const db = require('../db/index.js');
const fetch = require('node-fetch');
const Logger = require('../lib/Logger');
const router = express.Router();
const logger = new Logger('💈');

router.get('/', (req, res) => {
  const barbershopQuery = 'select * from barbershops'
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      logger.error(error)
      res.send({ error })
    } else {
      logger.success('/barbershops')
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
      logger.error(`/barbershops: ${error}`)
      res.send({ error })
    } else {
      logger.success('/barbershops')
      res.send(result) 
    }
  })
})

router.get('/distance', (req, res) => {
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
        logger.success('GET /barbershops/distance')
        res.send(result)
      }).catch(err => {
        logger.error(`GET /barbershops/distance: ${err}`)
        res.send(err)
      })
    }
  })
})

router.get('/:id', (req, res) => {
  const barbershopId = req.params.id
  const barbershopQuery = `select * from barbershops WHERE id = ${req.params.id}`
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      logger.error(`GET /barbershops/${barbershopId}: ${error}`)
      logger.error(`Failing query: ${barbershopQuery}`)
      res.send({ error })
    } else {
      logger.success(`GET /barbershops/${barbershopId}`)
      res.send(result.rows)
    }
  })
})

module.exports = router