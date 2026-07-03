import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

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

export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (error) {
    // Log everything, not just error.message — some Node versions throw
    // AggregateError for DNS/connection failures with an empty top-level
    // message, and the real detail is nested in error.errors instead.
    console.error('❌ MySQL connection failed');
    console.error('   code:', error.code);
    console.error('   message:', error.message || '(empty)');
    console.error('   host attempted:', process.env.DB_HOST);
    console.error('   port attempted:', process.env.DB_PORT);
    console.error('   user attempted:', process.env.DB_USER);
    console.error('   database attempted:', process.env.DB_NAME);
    if (error.errors) {
      console.error('   underlying errors:', JSON.stringify(error.errors, null, 2));
    }
    process.exit(1);
  }
};

export default pool;