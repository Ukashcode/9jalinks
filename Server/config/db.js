import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// A connection pool is used instead of a single connection so the app can
// handle multiple concurrent requests without waiting on one connection.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Quick sanity check used on server startup to fail fast if the DB is
// unreachable, rather than discovering it on the first API request.
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error.message);
    process.exit(1);
  }
};

export default pool;