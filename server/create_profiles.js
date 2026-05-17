const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL
});

async function run() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        await client.query(`
            CREATE TABLE IF NOT EXISTS user_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
                national_id_or_passport VARCHAR(100),
                contact_number VARCHAR(50),
                home_address TEXT,
                guardian_name VARCHAR(255),
                guardian_contact VARCHAR(50),
                health_condition TEXT,
                rfid_tag VARCHAR(100) UNIQUE,
                biometric_data_id VARCHAR(100) UNIQUE,
                access_status VARCHAR(50) DEFAULT 'active',
                metadata JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ Created user_profiles table successfully');

        // Add a dummy profile so the test works
        await client.query(`
            INSERT INTO user_profiles (user_id, rfid_tag, access_status) 
            VALUES (1, 'A1B2C3D4', 'active')
            ON CONFLICT (user_id) DO NOTHING;
        `);
        console.log('✅ Added test user profile data');

    } catch (e) {
        console.error('❌ Error:', e);
    } finally {
        await client.end();
        console.log('Database connection closed');
    }
}

run();
