const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const updateSchema = async () => {
    try {
        console.log('🚀 Starting Phase 3 Schema Update...');

        // 1. Create Notifications Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                message TEXT NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ notifications table ready.');

        // 2. Add biometric_enabled to users
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS biometric_enabled BOOLEAN DEFAULT TRUE;
        `);
        console.log('✅ users.biometric_enabled ready.');

        // 3. Create Access Logs (if not exists)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS access_logs (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                method VARCHAR(50) NOT NULL, -- 'APP', 'BIOMETRIC', 'NFC'
                door_id VARCHAR(50) DEFAULT 'DOOR_001',
                status VARCHAR(20) DEFAULT 'SUCCESS',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ access_logs table ready.');

        // 4. Seed some test notifications
        // We need a user ID first. Let's try to grab the first user.
        const userRes = await pool.query('SELECT id FROM users LIMIT 1');
        if (userRes.rows.length > 0) {
            const userId = userRes.rows[0].id;
            await pool.query(`
                INSERT INTO notifications (user_id, message, is_read) 
                VALUES 
                ($1, 'Welcome to Cortex! Complete your profile.', false),
                ($1, 'Security Alert: New login detected.', false)
                ON CONFLICT DO NOTHING; -- Simple skip if we ran this before (mostly for id collisions ideally, but here just lazy insert)
            `, [userId]);
            console.log('🌱 Seeded test notifications.');
        }

        console.log('🎉 Phase 3 Schema Update Complete.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Update failed:', err);
        process.exit(1);
    }
};

updateSchema();
