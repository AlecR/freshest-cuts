const express = require('express');
const db = require('../db/index.js');
const Logger = require('../lib/Logger');
const router = express.Router();
const logger = new Logger('💇🏼‍♂️');

router.get('/services', (req, res) => {
  const servicesQuery = 'select * from services'
  db.query(servicesQuery, (error, result) => {
    if (error) {
      logger.error(`GET /services/: ${error}`)
      res.send({ error })
    } else {
      logger.success(`GET /services/`)
      res.send(result.rows)
    }
  })
})

router.post('/services', (req, res) => {
  const {barbershop_id, name, description, price} = req.body.formData
  const hoursQuery = `
    INSERT INTO services 
	  (barbershop_id, name, description, price)
	  VALUES
    (${barbershop_id},  '${name}', '${description}', '${price}');`
  db.query(hoursQuery, (error, result) => {
    if (error) {
      logger.error(`POST /services/: ${error}`)
      res.send({ error })
    } else {
      logger.success(`POST /services/`)
      res.send(result)
    }
  })
})

module.exports = router