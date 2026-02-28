require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const seed = async () => {
    try {
        console.log('🌱 Starting Production Seed...');

        // 1. Ensure Default Admin User
        const adminEmail = 'demo@admin.com';
        const adminPass = 'password';
        const hashedPassword = await bcrypt.hash(adminPass, 10);

        const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [adminEmail]);

        if (userCheck.rows.length === 0) {
            await pool.query(`
                INSERT INTO users (id, full_name, email, password_hash, role, wallet_balance, is_active)
                VALUES (gen_random_uuid(), 'System Admin', $1, $2, 'admin', 100000.00, true)
            `, [adminEmail, hashedPassword]);
            console.log('✅ Default Admin User created.');
        } else {
            console.log('ℹ️ Admin user already exists. Skipping.');
        }

        // 2. Clear & Seed Smart Locks
        // Note: In prod, you might not want to DELETE all locks, but for this "Clean Slate" request we will.
        // If we want upsert, we can do that, but user asked for these specific locks.
        await pool.query('DELETE FROM smart_locks'); // Clean start for hardware list

        const locks = [
            { name: "Main Entrance", model: "TL90", batt: 85, status: true, loc: "Reception" },
            { name: "Warehouse A", model: "TL60", batt: 12, status: false, loc: "Storage Zone" },
            { name: "Office 101", model: "TL90", batt: 100, status: true, loc: "First Floor" }
        ];

        for (const lock of locks) {
            await pool.query(`
                INSERT INTO smart_locks (id, device_name, model, battery_level, online_status, location, tuya_device_id)
                VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, gen_random_uuid())
            `, [lock.name, lock.model, lock.batt, lock.status, lock.loc]);
        }
        console.log(`✅ Seeded ${locks.length} Smart Locks.`);

        console.log('🏁 Seeding Complete!');
        process.exit(0);

    } catch (err) {
        console.error('❌ Seeding Failed:', err);
        process.exit(1);
    }
};

seed();
