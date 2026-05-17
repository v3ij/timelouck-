-- =========================================================================
-- DYNAMIC SCHEMA EXTENSION: Multi-Industry Support (Schools, Hotels, Commercial)
-- =========================================================================

-- 1. Add Flexible Metadata Columns to Core Tables (If not modifying existing create scripts)
-- Note: In the codebase, this is already added to the CREATE TABLE scripts in seed.js.
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 2. User Profiles (Standard fields for National ID, Passport, Address, etc.)
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

-- 3. Contracts and Bookings (Hotel short stay, Apartment lease, School fees)
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

-- 4. Attendance and Reports (Student daily attendance, employee performance summaries)
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
