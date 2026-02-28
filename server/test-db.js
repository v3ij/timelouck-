const { Pool } = require('pg');
require('dotenv').config();

console.log('Testing DB connection with URL:', process.env.DATABASE_URL ? 'PRESENT' : 'MISSING');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        console.log('Attempting to connect...');
        const client = await pool.connect();
        console.log('Connected! Fetching time...');
        const res = await client.query('SELECT NOW()');
        console.log('Time:', res.rows[0].now);
        client.release();
    } catch (e) {
        console.error('Connection error:', e);
    } finally {
        await pool.end();
        console.log('Finished.');
    }
}

run();
