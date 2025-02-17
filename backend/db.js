const mysql = require('mysql2');
require('dotenv').config();

// Create the connection pool for MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'contact_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Export the connection pool with Promises enabled
module.exports = db.promise();
