import dotenv from 'dotenv';
import app from './app.js';
import { testConnection } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testConnection();

  app.listen(PORT, () => {
    console.log(`🚀 9jaLinks API running on http://localhost:${PORT}`);
  });
};

startServer();