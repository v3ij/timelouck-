
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function verify() {
    const client = await pool.connect();
    try {
        const resUsers = await client.query('SELECT COUNT(*) FROM users');
        const resLocks = await client.query('SELECT COUNT(*) FROM smart_locks');
        const resDevices = await client.query('SELECT device_name, model FROM smart_locks');

        console.log('--- Verification Report ---');
        console.log(`Users Count: ${resUsers.rows[0].count}`);
        console.log(`Locks Count: ${resLocks.rows[0].count}`);
        console.log('Devices:', resDevices.rows);
        console.log('---------------------------');
    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

verify();
