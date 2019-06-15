const express = require('express');
const bodyParser = require('body-parser');
const barbershopRouter = require('./routers/barbershopsRouter');
const hoursRouter = require('./routers/businessHoursRouter');
const servicesRouter = require('./routers/servicesRouter');

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

const addRouter = (name, router) => {
	app.use(`/api/${name}`, middleware, router)
};

addRouter('barbershops', barbershopRouter)
addRouter('hours', hoursRouter)
addRouter('services', servicesRouter)

const server = app.listen(PORT, "127.0.0.1", () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log('🚀  Server running at http://' + host + ':' + port)
});