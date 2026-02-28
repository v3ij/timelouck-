-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'staff', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE lock_model AS ENUM ('TL90', 'TL60');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE access_method AS ENUM ('fingerprint', 'face', 'card', 'app', 'remote');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE audit_status AS ENUM ('granted', 'denied');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('topup', 'access_fee', 'penalty');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. UPDATE USERS (Keep ID as INT for compatibility, add new columns)
ALTER TABLE users ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer';
ALTER TABLE users ADD COLUMN IF NOT EXISTS rfid_card_id VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS biometric_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update role based on legacy is_admin flag if valid
UPDATE users SET role = 'admin' WHERE is_admin = true AND role = 'customer';

-- 3. CLEANUP & RECREATE DEPENDENT TABLES
-- We drop these to ensure they are created with correct UUID/INT foreign keys
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS smart_locks;

-- 4. SMART LOCKS (UUID PK)
CREATE TABLE smart_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_name VARCHAR(100) NOT NULL,
    model lock_model NOT NULL,
    tuya_device_id VARCHAR(100) UNIQUE NOT NULL,
    battery_level INTEGER DEFAULT 100,
    online_status BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ACCESS LOGS (User FK is INT, Lock FK is UUID)
CREATE TABLE access_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    lock_id UUID REFERENCES smart_locks(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    access_method access_method NOT NULL,
    status audit_status NOT NULL,
    snapshot_url TEXT
);

-- 6. TRANSACTIONS (UUID PK, User FK is INT)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    vat_amount DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    invoice_reference VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RECREATE INVOICES (Linked to Transaction UUID)
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    transaction_id UUID REFERENCES transactions(id),
    amount DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'PAID',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_rfid ON users(rfid_card_id);
CREATE INDEX IF NOT EXISTS idx_logs_user ON access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_lock ON access_logs(lock_id);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON access_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
