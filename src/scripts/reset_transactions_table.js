const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const fix = async () => {
    try {
        console.log('🔧 Fixing transactions table...');

        // Drop the table to clear bad schema
        await pool.query('DROP TABLE IF EXISTS transactions CASCADE');
        console.log('🗑️  Old table dropped (CASCADE).');

        // Recreate with correct schema
        await pool.query(`
            CREATE TABLE transactions (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                amount DECIMAL(10, 2) NOT NULL,
                type VARCHAR(20) NOT NULL,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ New transactions table created with correct columns.');

        process.exit(0);
    } catch (err) {
        console.error('❌ Fix failed:', err);
        process.exit(1);
    }
};

fix();
