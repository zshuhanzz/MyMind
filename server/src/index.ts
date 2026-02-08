import app from './app.js';
import { env } from './config/environment.js';
import logger from './utils/logger.js';
import pool from './config/database.js';
import { initializeScheduler } from './services/scheduler.service.js';

async function start() {
  let dbConnected = false;
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    logger.info('Connected to PostgreSQL');
    dbConnected = true;
  } catch (err) {
    logger.warn('PostgreSQL not available — running without database', { error: (err as Error).message });
  }

  if (dbConnected) {
    initializeScheduler();
  }

  app.listen(env.port, () => {
    logger.info(`MindBridge server running on port ${env.port}`);
  });
}

start();
