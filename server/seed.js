const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const pool = require('./config/db');

const seedDatabase = async () => {
    console.log('🌱 Pre-flight DB check:', process.env.DATABASE_URL ? 'URL exists' : 'URL NOT FOUND');

    let client;
    try {
        client = await pool.connect();
        console.log('🌱 Starting database seeding...');
        await client.query('BEGIN');

        // 0. Initialize Schema (DROP THEN CREATE TO AVOID SCHEMA CONFLICTS)
        console.log('- Initializing Database Schema...');
        await client.query(`
            DROP TABLE IF EXISTS attendance_and_reports CASCADE;
            DROP TABLE IF EXISTS contracts_and_bookings CASCADE;
            DROP TABLE IF EXISTS user_profiles CASCADE;
            DROP TABLE IF EXISTS transactions CASCADE;
            DROP TABLE IF EXISTS access_logs CASCADE;
            DROP TABLE IF EXISTS wallets CASCADE;
            DROP TABLE IF EXISTS devices CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TABLE IF EXISTS tenants CASCADE;

            CREATE TABLE tenants (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL, -- e.g., 'school', 'hotel', 'apartment'
                metadata JSONB DEFAULT '{}', -- Flexible data for specific industries
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255),
                role VARCHAR(50) DEFAULT 'user',
                rfid_tag VARCHAR(100),
                is_biometric_enrolled BOOLEAN DEFAULT false,
                metadata JSONB DEFAULT '{}', -- Flexible data: Health conditions, Parent bank, Lost items
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS wallets (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                balance_ugx NUMERIC(12,2) DEFAULT 0,
                status VARCHAR(50) DEFAULT 'active',
                last_deduction_at TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS devices (
                id SERIAL PRIMARY KEY,
                tenant_id INTEGER REFERENCES tenants(id),
                device_name VARCHAR(255) NOT NULL,
                mac_address VARCHAR(100) UNIQUE NOT NULL,
                model VARCHAR(50),
                hardware_model VARCHAR(100) DEFAULT 'Timmy TL90',
                tuya_id VARCHAR(255),
                battery_level INTEGER DEFAULT 100,
                auth_methods_supported JSONB DEFAULT '["Face", "Fingerprint", "RFID", "Code"]',
                is_online BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS access_logs (
                id SERIAL PRIMARY KEY,
                device_id INTEGER REFERENCES devices(id),
                user_id INTEGER REFERENCES users(id),
                auth_method VARCHAR(50),
                status VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS transactions (
                id SERIAL PRIMARY KEY,
                wallet_id INTEGER REFERENCES wallets(id),
                amount NUMERIC(12,2) NOT NULL,
                transaction_type VARCHAR(50) NOT NULL,
                reference_code VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- -------------------------------------------------------------
            -- DYNAMIC SCHEMA EXTENSION: Multi-Industry Support
            -- -------------------------------------------------------------

            CREATE TABLE IF NOT EXISTS user_profiles (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
                national_id VARCHAR(100),
                passport_number VARCHAR(100),
                address TEXT,
                emergency_contact_name VARCHAR(255),
                emergency_contact_phone VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS contracts_and_bookings (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
                contract_type VARCHAR(50) NOT NULL, -- 'hotel_stay', 'apartment_lease', 'school_term'
                start_date TIMESTAMP NOT NULL,
                end_date TIMESTAMP,
                status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'cancelled'
                amount_paid NUMERIC(12,2) DEFAULT 0,
                days_weeks_paid INTEGER DEFAULT 0,
                contract_file_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS attendance_and_reports (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                tenant_id INTEGER REFERENCES tenants(id) ON DELETE CASCADE,
                report_date DATE NOT NULL,
                status VARCHAR(50), -- 'present', 'absent', 'late'
                performance_score NUMERIC(5,2), -- 0 - 100
                daily_summary TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 1. Insert Tenants
        console.log('- Seeding Tenants...');
        const tenantSchool = await client.query(`
            INSERT INTO tenants (name, type) 
            VALUES ($1, $2) RETURNING id
        `, ['Kampala High', 'school']);

        const tenantHotel = await client.query(`
            INSERT INTO tenants (name, type) 
            VALUES ($1, $2) RETURNING id
        `, ['Grand Kampala Suites', 'hotel']);

        const schoolId = tenantSchool.rows[0].id;
        const hotelId = tenantHotel.rows[0].id;

        // 2. Insert Devices
        console.log('- Seeding Devices...');
        const deviceSchool = await client.query(`
            INSERT INTO devices (tenant_id, device_name, mac_address, model, is_online)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `, [schoolId, 'Main Gate Lock', '00:1A:2B:3C:4D:5E', 'TL90', true]);

        const deviceHotel = await client.query(`
            INSERT INTO devices (tenant_id, device_name, mac_address, model, is_online)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `, [hotelId, 'Room 101 Lock', '00:1A:2B:3C:4D:5F', 'TL60', true]);

        // 3. Insert Users
        console.log('- Seeding Users...');
        const userAhmed = await client.query(`
            INSERT INTO users (tenant_id, full_name, email, role, rfid_tag, is_biometric_enrolled)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `, [schoolId, 'Ahmed Ali', 'ahmed@kampalahigh.edu', 'user', 'RFID-8892', true]);

        const userJohn = await client.query(`
            INSERT INTO users (tenant_id, full_name, email, role, rfid_tag, is_biometric_enrolled)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
        `, [hotelId, 'John Doe', 'john@grandkampala.com', 'user', 'RFID-1122', false]);

        const ahmedId = userAhmed.rows[0].id;
        const johnId = userJohn.rows[0].id;

        // 4. Insert Wallets
        console.log('- Seeding Wallets...');
        await client.query(`
            INSERT INTO wallets (user_id, balance_ugx)
            VALUES ($1, $2)
        `, [ahmedId, 15000]);

        await client.query(`
            INSERT INTO wallets (user_id, balance_ugx)
            VALUES ($1, $2)
        `, [johnId, 50000]);

        await client.query('COMMIT');
        console.log('✅ Database seeded successfully!');

    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error('❌ Seeding error:', error);
    } finally {
        if (client) client.release();
        await pool.end();
        process.exit(0);
    }
};

seedDatabase();
