const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const initSchema = async () => {
    try {
        console.log('🔌 Connecting to database...');

        // 1. Ensure wallet_balance exists in users
        console.log('Checking users table...');
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS wallet_balance DECIMAL(10, 2) DEFAULT 0.00;
        `);
        console.log('✅ users table verified (wallet_balance column).');

        // 2. Create transactions table
        console.log('Checking transactions table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(20) NOT NULL, -- 'TOPUP', 'PAYMENT'
                description TEXT,
                status VARCHAR(20) DEFAULT 'COMPLETED',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        // Ensure status column exists
        await pool.query(`
            ALTER TABLE transactions 
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'COMPLETED';
        `);
        console.log('✅ transactions table verified.');

        // 3. Add Access Control Columns
        console.log('Checking access control columns...');
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS access_expiry TIMESTAMP,
            ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;
        `);
        console.log('✅ Access control columns verified.');

        // 4. Create access_logs table
        console.log('Checking access_logs table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS access_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        // Ensure columns exist (if table already existed but old)
        await pool.query(`
            ALTER TABLE access_logs 
            ADD COLUMN IF NOT EXISTS method VARCHAR(50),
            ADD COLUMN IF NOT EXISTS door_id VARCHAR(50),
            ADD COLUMN IF NOT EXISTS status VARCHAR(50);
        `);
        console.log('✅ access_logs table verified.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Database initialization failed:', err);
        process.exit(1);
    }
};

initSchema();
