const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const db = require('./db/index.js');

const PORT = process.env.PORT || 5000
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const middleware = (_, res, next) => {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', ['GET', 'PUT', 'DELETE', 'POST']);
	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
	// Pass to next layer of middleware
	next();
};

app.use(middleware)

app.get('/barbershops', (req, res) => {
  const barbershopQuery = 'select * from barbershops'
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      res.send({ error })
    } else {
      res.send(result.rows)
    }
  })
})

app.get('/barbershops/distance', (req, res) => {
  const key = 'AIzaSyBSZp93QBZgVxXWSkMZiJpGGFyu1H4VOZk'
  const lat = req.query.lat
  const lon = req.query.lon
  const barbershopIds = req.query.barbershopIds
  const addressQuery = `select barbershops.address from barbershops where id in (${barbershopIds})`
  db.query(addressQuery, (error, result) => {
    if (error) {
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
        res.send(result)
      }).catch(err => {
        res.send(err)
      })
    }
  })
})

app.post('/barbershops', (req, res) => {
  const {name, address, website_address, apppointment_scheduling_address, 
         cash_only, price_level} = req.body.formData
  const barbershopQuery = `
    INSERT INTO barbershops 
	  (name, address, website_address, appointment_scheduling_address, cash_only, price_level)
	  VALUES
    ('${name}', '${address}',  '${website_address}', '${apppointment_scheduling_address}', ${cash_only}, ${price_level});`
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      res.send({ error })
    } else {
      res.send(result) 
    }
  })
})

app.get('/hours', (req, res) => {
  const barbershopQuery = 'select * from business_hours'
  db.query(barbershopQuery, (error, result) => {
    if (error) {
      res.send({ error })
    } else {
      if (result.rows.length < 1) {
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
      res.send(formattedHours)
    }
  })
})

app.post('/hours', (req, res) => {
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
      res.send({ error })
    } else {
      res.send(result)
    }
  })
})

app.delete('/hours', (req, res) => {
  var id = req.query.id
  const hoursQuery = `DELETE FROM business_hours WHERE id = ${id};`
  db.query(hoursQuery, (error, result) => {
    if (error) {
      res.send({ error })
    } else {
      res.send(result)
    }
  })
})

app.get('/services', (req, res) => {
  const servicesQuery = 'select * from services'
  db.query(servicesQuery, (error, result) => {
    if (error) {
      res.send({ error })
    } else {
      res.send(result.rows)
    }
  })
})

app.post('/services', (req, res) => {
  const {barbershop_id, name, description, price} = req.body.formData
  const hoursQuery = `
    INSERT INTO services 
	  (barbershop_id, name, description, price)
	  VALUES
    (${barbershop_id},  '${name}', '${description}', '${price}');`
  console.log(hoursQuery)
  db.query(hoursQuery, (error, result) => {
    if (error) {
      res.send({ error })
    } else {
      res.send(result)
    }
  })
})


const server = app.listen(PORT, "127.0.0.1", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('🚀  Server running at http://' + host + ':' + port)
});