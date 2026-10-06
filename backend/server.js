import 'dotenv/config';
import app from './src/app.js';
import pool from './src/config/db.js';

const PORT = Number(process.env.PORT) || 5000;

try {
  await pool.query('SELECT 1');
  console.log('PostgreSQL connected');
} catch (err) {
  console.error('Could not connect to PostgreSQL:', err.message);
  console.error('Check your .env values and make sure the database exists (npm run db:init).');
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

const shutdown = () => server.close(() => pool.end().then(() => process.exit(0)));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
