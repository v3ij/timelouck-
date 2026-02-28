-- Phase 2 Updates
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expiry TIMESTAMPTZ;

-- Phase 3: Financial Backend
CREATE TABLE IF NOT EXISTS tax_settings (
    id SERIAL PRIMARY KEY,
    vat_percentage DECIMAL(5, 2) DEFAULT 18.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tax setting if not exists
INSERT INTO tax_settings (vat_percentage) 
SELECT 18.00 WHERE NOT EXISTS (SELECT 1 FROM tax_settings);

CREATE TABLE IF NOT EXISTS invoices (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    transaction_id INT REFERENCES transactions(id),
    amount DECIMAL(12, 2) NOT NULL,
    tax_amount DECIMAL(12, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'PAID',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revenue_streams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_revenue DECIMAL(15, 2) DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
