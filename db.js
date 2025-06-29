const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'DESKTOP-058QSKG',
  user: 'root',
  password: 'yes', // Substitua pela sua senha do MySQL
  port: 3306, // Porta padrão do MySQL
  database: 'MerceariaAPI',
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = pool;
