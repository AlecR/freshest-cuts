const express = require('express');
const db = require('../db/index.js');
const Logger = require('../lib/Logger');
const router = express.Router();
const logger = new Logger('💇🏼‍♂️');

router.get('/', (req, res) => {
  let servicesQuery = 'select * from services'
  if (req.query.barbershopId) {
    servicesQuery += ` WHERE barbershop_id = ${req.query.barbershopId}`
  }
  db.query(servicesQuery, (error, result) => {
    if (error) {
      logger.error(`GET ${req.originalUrl}: ${error}`)
      logger.error(`Query: ${servicesQuery}`)
      res.send({ error })
    } else {
      logger.success(`GET ${req.originalUrl}`)
      res.send(result.rows)
    }
  })
})

router.post('/', (req, res) => {
  const {barbershop_id, name, description, price} = req.body.formData
  const hoursQuery = `
    INSERT INTO services 
	  (barbershop_id, name, description, price)
	  VALUES
    (${barbershop_id},  '${name}', '${description}', '${price}');`
  db.query(hoursQuery, (error, result) => {
    if (error) {
      logger.error(`POST ${req.originalUrl}: ${error}`)
      res.send({ error })
    } else {
      logger.success(`POST ${req.originalUrl}`)
      res.send(result)
    }
  })
})

module.exports = router