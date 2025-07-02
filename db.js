const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // ALTERAR A SENHA!!!
  port: 3306,
  database: 'MerceariaAPI',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
