const express = require('express');
const db = require('../db/index.js');
const Logger = require('../lib/Logger');
const router = express.Router();
const logger = new Logger('⏰');

router.get('/', (req, res) => {
  const barbershopQuery = 'select * from business_hours'
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      logger.error(`GET /hours/: ${error}`)
      res.send({ error })
    } else {
      if (result.rows.length < 1) {
        logger.success('/hours/')
        res.send([])
      }
      const formattedHours = result.rows.map(hoursRow => ({
        id: hoursRow.id,
        barbershopId: hoursRow.barbershop_id,
        day: hoursRow.day,
        open: hoursRow.open,
        openTime: hoursRow.open_time,
        closeTime: hoursRow.close_time
      }))
      logger.success('GET /hours/')
      res.send(formattedHours)
    }
  })
})

router.post('/', (req, res) => {
  var {barbershopId, day, open, openTime, closeTime} = req.body.formData
  if (!open) {
    openTime = null
    closeTime = null
  } else {
    openTime = `'${openTime}'`
    closeTime = `'${closeTime}'`
  }
  const hoursQuery = `
    INSERT INTO business_hours 
	  (barbershop_id, day, open, open_time, close_time)
	  VALUES
    ('${barbershopId}',  ${day}, '${open}', ${openTime}, ${closeTime});`
  db.query(hoursQuery, (error, result) => {
    if (error) {
      logger.error(`POST /hours/: ${error}`)
      res.send({ error })
    } else {
      logger.success('POST /hours/')
      res.send(result)
    }
  })
})

router.delete('/hours', (req, res) => {
  var id = req.query.id
  const hoursQuery = `DELETE FROM business_hours WHERE id = ${id};`
  db.query(hoursQuery, (error, result) => {
    if (error) {
      logger.error(`DELETE /hours/: ${error}`)
      res.send({ error })
    } else {
      logger.success(`DELETE /hours/`)
      res.send(result)
    }
  })
})

module.exports = router