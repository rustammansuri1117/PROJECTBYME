import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pool from '../src/config/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = await fs.readFile(path.join(__dirname, '../sql/schema.sql'), 'utf8');

try {
  await pool.query(sql);
  console.log('Table "hotels" is ready.');
} catch (err) {
  console.error('Schema setup failed:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
