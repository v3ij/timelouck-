require('dotenv').config();
const { Pool } = require('pg');

console.log("🔍 Testing Database Connection...");
console.log(`URL available: ${!!process.env.DATABASE_URL}`);
if (process.env.DATABASE_URL) {
    console.log(`URL starts with: ${process.env.DATABASE_URL.substring(0, 15)}...`);
    // Mask password
    const masked = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':***@');
    console.log(`URL pattern: ${masked}`);
}

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

// Test config matching the app
const config = {
    connectionString,
    ssl: isProduction || connectionString?.includes('neon.tech')
        ? { rejectUnauthorized: false }
        : false
};

console.log(`SSL Config: ${JSON.stringify(config.ssl)}`);

const pool = new Pool(config);

(async () => {
    try {
        const client = await pool.connect();
        console.log("✅ Connection Successful!");

        const res = await client.query('SELECT NOW(), version()');
        console.log(`🕒 Server Time: ${res.rows[0].now}`);
        console.log(`ℹ️  Version: ${res.rows[0].version}`);

        // Check for users table
        try {
            const userRes = await client.query('SELECT count(*) FROM users');
            console.log(`👥 Users Table: Found ${userRes.rows[0].count} users.`);
        } catch (tableErr) {
            console.warn("⚠️  Users table query failed:", tableErr.message);
        }

        client.release();
        process.exit(0);
    } catch (err) {
        console.error("❌ Connection FAILED:");
        console.error(`Code: ${err.code}`);
        console.error(`Message: ${err.message}`);
        if (err.cause) console.error(`Cause:`, err.cause);
        process.exit(1);
    }
})();
