const { Pool } = require('pg');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: isProduction || connectionString?.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    getClient: () => pool.connect(), // Expose client for Transactions
};
