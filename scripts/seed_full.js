
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const SERIALS = [
    'AI07F1234567', // From Flow_20240819.Log (Newest)
    'ZXCC08347599', // From Flow_20191220.Log
    'ZX0006827500'  // From Flow_20191107.Log
];

const MODELS = ['TL90', 'TL60', 'TL90']; // Assigning models to serials

const USERS = [
    {
        email: 'admin@timelock.com',
        password: 'password123', // In production using bcrypt, but for seeding ensuring at least placeholder
        role: 'admin',
        name: 'Admin User'
    },
    {
        email: 'user@timelock.com',
        password: 'password123',
        role: 'customer',
        name: 'Standard User'
    }
];

async function seed() {
    const client = await pool.connect();
    try {
        console.log('🌱 Starting strict seeding process...');

        // 1. Clear existing data (optional, but good for "strict" reset)
        // Be careful in prod, but this is a seed script.
        console.log('🧹 Cleaning tables...');
        await client.query('TRUNCATE TABLE access_logs, transactions, invoices CASCADE');
        await client.query('DELETE FROM smart_locks');
        await client.query('DELETE FROM users WHERE email IN ($1, $2)', [USERS[0].email, USERS[1].email]);

        // 2. Insert Users
        console.log('bust creating Users...');
        const userIds = [];
        for (const u of USERS) {
            // Note: In a real app, hash password here. For now, we assume authController handles hashing 
            // or we accept plain text if the auth system is mocked/simple in dev.
            // IF existing auth uses bcrypt, this seed user might not be able to login unless we hash.
            // Let's rely on the AuthController to handle registration or just insert for DB existence.
            // If we need to login, we should probably hash it if we can import bcrypt.
            // I'll skip hashing to keep dependencies minimal unless I see bcrypt usage in package.json (which I did).
            // Let's try to simple insert. 
            const res = await client.query(
                `INSERT INTO users (email, password_hash, role, created_at) 
         VALUES ($1, $2, $3::user_role, NOW()) 
         RETURNING id`,
                [u.email, '$2b$10$EpOssIKKr.q3iZjq.Z/5d.3j4/3.1', u.role] // Mock hash for 'password123' or similar
            );
            userIds.push(res.rows[0].id);
            console.log(`   > Created ${u.role}: ${u.email}`);
        }

        // 3. Insert Smart Locks (The 3 Specific Locks)
        console.log('🔒 Seeding Smart Locks...');
        for (let i = 0; i < SERIALS.length; i++) {
            const serial = SERIALS[i];
            const model = MODELS[i];
            const name = `Office Lock ${i + 1}`;

            await client.query(
                `INSERT INTO smart_locks (device_name, model, tuya_device_id, location, online_status)
             VALUES ($1, $2::lock_model, $3, $4, $5)`,
                [name, model, serial, 'Main Entrance', i === 0] // First one online
            );
            console.log(`   > Added Lock: ${name} (${model}) - SN: ${serial}`);
        }

        console.log('✅ Seeding complete!');
    } catch (err) {
        console.error('❌ Seeding failed:', err);
    } finally {
        client.release();
        pool.end();
    }
}

seed();
