import pg from 'pg';

const { Pool, types } = pg;

// NUMERIC columns (price, latitude, longitude) come back as strings by default.
// Parse them to JS numbers so the API returns real numbers.
types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value));
// DATE columns (check_in / check_out) stay plain 'YYYY-MM-DD' strings (no timezone shifting)
types.setTypeParser(types.builtins.DATE, (value) => value);

const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'hotel_db',
      }
);

pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL error:', err);
});

export default pool;
