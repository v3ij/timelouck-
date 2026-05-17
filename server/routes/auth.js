const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Mock Email Sender (Replace with SendGrid/Resend in production)
const sendEmail = async (to, subject, text) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
        console.log(`[Mock Email] Content: ${text}`);
        return;
    }
    console.log(`Did not send email to ${to} because logic is hidden.`);
};

/**
 * POST /api/auth/register or /api/register
 * Registers a new user and provisions their digital wallet.
 */
router.post('/register', async (req, res) => {
    const { email, password, fullName, phone, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password are required.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if user exists
        const userExists = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({ status: 'error', message: 'Email already exists, please login.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role || 'user';
        const name = fullName || email.split('@')[0];

        // Create user
        const userResult = await client.query(
            `INSERT INTO users (full_name, email, password_hash, phone, role) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [name, email, hashedPassword, phone || '', userRole]
        );
        const newUser = userResult.rows[0];

        // Create wallet linked to this user
        await client.query(
            `INSERT INTO wallets (user_id, balance_ugx, status) 
             VALUES ($1, 0, 'active')`,
            [newUser.id]
        );

        await client.query('COMMIT');

        // Generate token
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '24h' });

        res.status(201).json({
            status: 'success',
            token,
            user: {
                id: newUser.id,
                full_name: newUser.full_name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Registration error:', err);
        res.status(500).json({ status: 'error', message: err.message || 'Server error' });
    } finally {
        client.release();
    }
});

/**
 * POST /api/auth/login or /api/login
 * Authenticates a user based on email (password is checked via bcrypt or fallback MVP bypasses)
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 3-Tier SaaS System Owner Bypass
        if (email === 'owner@company.com' && password === 'password') {
            return res.json({
                status: 'success',
                role: 'superadmin',
                tenant_type: 'none',
                token: 'mock-jwt-token-superadmin',
                user: { id: 0, full_name: 'System Owner', email }
            });
        }

        // Tenant Admin (School) Bypass
        if (email === 'ahmed@school.com' && password === 'password') {
            return res.json({
                status: 'success',
                role: 'school',
                tenant_type: 'school',
                token: 'mock-jwt-token-school-admin',
                user: { id: 888, full_name: 'Ahmed (School Admin)', email, tenant_name: 'Test School' }
            });
        }

        // Test User End-User Dashboard Bypass
        if (email === 'user@test.com' && password === 'password') {
            return res.json({
                status: 'success',
                role: 'user',
                tenant_type: 'none',
                token: 'mock-jwt-token-test-user',
                user: { id: 999, full_name: 'Test Setup User', email, tenant_name: 'Local Dev Account' }
            });
        }

        // Query database for user
        const result = await pool.query(`
            SELECT u.*, t.type as tenant_type, t.name as tenant_name 
            FROM users u
            LEFT JOIN tenants t ON u.tenant_id = t.id
            WHERE u.email = $1
        `, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized Access Domain' });
        }

        const user = result.rows[0];

        // Check password using bcrypt if password_hash is populated, or fallback to MVP password check
        if (user.password_hash) {
            const validPassword = await bcrypt.compare(password, user.password_hash);
            if (!validPassword) {
                return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
            }
        } else if (password !== 'password') {
            return res.status(401).json({ status: 'error', message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'supersecretkey', { expiresIn: '24h' });

        res.json({
            status: 'success',
            role: user.role, // e.g., 'user', 'admin'
            tenant_type: user.tenant_type, // 'school', 'hotel'
            token,
            user: {
                id: user.id,
                tenant_id: user.tenant_id,
                full_name: user.full_name,
                email: user.email,
                tenant_name: user.tenant_name
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

/**
 * POST /api/auth/forgot-password or /api/forgot-password
 * Triggers sending a reset link via email.
 */
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: "User not found" });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
            [tokenHash, expiry, email]
        );

        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        await sendEmail(email, "Password Reset Request", `Click here to reset: ${resetUrl}`);

        res.json({ status: 'success', message: "Reset link sent to email." });
    } catch (err) {
        console.error('Forgot password error:', err);
        res.status(500).json({ status: 'error', message: "Server error" });
    }
});

/**
 * POST /api/auth/reset-password or /api/reset-password
 * Sets a new password using the valid reset token.
 */
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await pool.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [tokenHash]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ status: 'error', message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
            [hashedPassword, user.rows[0].id]
        );

        res.json({ status: 'success', message: "Password updated successfully" });
    } catch (err) {
        console.error('Reset password error:', err);
        res.status(500).json({ status: 'error', message: "Server error" });
    }
});

module.exports = router;
