const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const verify = async () => {
    try {
        console.log('Testing connection...');
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful:', res.rows[0]);

        console.log('Checking transactions table...');
        const tableCheck = await pool.query("SELECT to_regclass('public.transactions')");
        console.log('Table check result:', tableCheck.rows[0]);

        if (!tableCheck.rows[0].to_regclass) {
            console.error('CRITICAL: transactions table does not exist!');
        } else {
            console.log('transactions table exists.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Verification failed:', err);
        process.exit(1);
    }
};

verify();
