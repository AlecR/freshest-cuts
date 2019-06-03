const postgres = require('pg');

const dbConfig = {
  user: 'alecrodgers',
  password: 'Norumbega2020',
  database: 'fc_staging',
  host: 'freshest-cuts.ccun1nexjqwz.us-east-1.rds.amazonaws.com',
  port: '5432',
  max: 25,
  idleTimeoutMillis: 1000,
}

const pool = new postgres.Pool(dbConfig)
pool.on('error', err => {
  console.log("!! -- DB ERROR -- !!");
  console.log(err);
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}