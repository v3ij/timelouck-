const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { Pool } = require('pg');

console.log("📡 Attempting to connect to Neon DB...");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    ssl: {
        rejectUnauthorized: false // Required for Neon DB connections
    }
});

pool.on('connect', () => {
    console.log('✅ Connected to Neon Cloud DB');
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle pg client', err);
    process.exit(-1);
});

module.exports = pool;
