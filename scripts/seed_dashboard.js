require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seedData() {
    try {
        await client.connect();

        // Check if users exist
        const userRes = await client.query("SELECT count(*) FROM users");
        if (parseInt(userRes.rows[0].count) < 5) {
            console.log("Seeding Users...");
            await client.query(`
                INSERT INTO users (email, password_hash, full_name, role, wallet_balance) VALUES 
                ('demo@admin.com', '$2a$10$X7...', 'Admin User', 'admin', 50000.00),
                ('staff@cortex.com', '$2a$10$X7...', 'John Staff', 'staff', 0.00),
                ('user1@gmail.com', '$2a$10$X7...', 'Alice Smith', 'customer', 15000.00),
                ('user2@gmail.com', '$2a$10$X7...', 'Bob Jones', 'customer', 25000.00)
                ON CONFLICT (email) DO NOTHING;
             `);
        }

        // Transactions
        console.log("Seeding Transactions...");
        // Need user IDs
        const users = await client.query("SELECT id FROM users");
        const userIds = users.rows.map(u => u.id);

        if (userIds.length > 0) {
            for (let i = 0; i < 15; i++) {
                const uid = userIds[Math.floor(Math.random() * userIds.length)];
                const amount = (Math.random() * 50000).toFixed(2);
                const vat = (amount * 0.18).toFixed(2);
                await client.query(`
                    INSERT INTO transactions (user_id, type, amount, vat_amount, net_amount, invoice_reference)
                    VALUES ($1, 'topup', $2, $3, $4, $5)
                 `, [uid, amount, vat, amount - vat, 'INV-' + Date.now() + '-' + i]);
            }
        }

        // Smart Locks
        console.log("Seeding Locks...");
        await client.query(`
            INSERT INTO smart_locks (device_name, model, tuya_device_id, battery_level, online_status, location) VALUES
            ('Main Entrance', 'TL90', 'dev_001', 85, TRUE, 'Lobby'),
            ('Server Room', 'TL60', 'dev_002', 42, TRUE, 'Floor 2'),
            ('Back Door', 'TL90', 'dev_003', 15, FALSE, 'Warehouse')
            ON CONFLICT (tuya_device_id) DO NOTHING;
        `);

        console.log("Seeding Complete.");

    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}

seedData();
