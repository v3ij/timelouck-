
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const LOCKS = [
    {
        tuya_device_id: 'AI07F1234567',
        device_name: 'Main Entrance',
        model: 'TL90',
        online_status: true,
        battery_level: 85,
        location: 'Building A, Front'
    },
    {
        tuya_device_id: 'ZXCC08347599',
        device_name: 'Gym Access',
        model: 'TL60',
        online_status: false,
        battery_level: 10,
        location: 'Basement Level'
    },
    {
        tuya_device_id: 'ZX0006827500',
        device_name: 'Office 101',
        model: 'TL90',
        online_status: true,
        battery_level: 100,
        location: '1st Floor'
    }
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🔓 Starting Lock Injection...');

        // Upsert logic to update if exists or insert if new
        for (const lock of LOCKS) {
            await client.query(
                `INSERT INTO smart_locks (device_name, model, tuya_device_id, online_status, battery_level, location)
                 VALUES ($1, $2::lock_model, $3, $4, $5, $6)
                 ON CONFLICT (tuya_device_id) 
                 DO UPDATE SET 
                    device_name = EXCLUDED.device_name,
                    online_status = EXCLUDED.online_status,
                    battery_level = EXCLUDED.battery_level,
                    location = EXCLUDED.location;`,
                [lock.device_name, lock.model, lock.tuya_device_id, lock.online_status, lock.battery_level, lock.location]
            );
            console.log(`   > Injected: ${lock.device_name} [${lock.online_status ? 'ONLINE' : 'OFFLINE'}]`);
        }
        console.log('✅ Device Population Complete.');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seed();
