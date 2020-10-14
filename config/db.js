const mysql = require('promise-mysql');

const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'rec',
  password : 'recommend',
  database : 'recommender'
});

module.exports = pool;
