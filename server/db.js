const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Scooby2012',
    database: 'petclinic',
});

pool.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
    } else {
      console.log('Database connected successfully');
      connection.release();
    }
  });

module.exports = pool.promise();