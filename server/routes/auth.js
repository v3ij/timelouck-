const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * POST /api/auth/login
 * Authenticates a user based on email (password is hardcoded to 'password' for MVP)
 */
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // MVP: Hardcoded password check
        if (password !== 'password') {
            return res.status(401).json({ status: 'error', message: 'Invalid Credentials' });
        }

        // 3-Tier SaaS System Owner Bypass
        if (email === 'owner@company.com') {
            return res.json({
                status: 'success',
                role: 'superadmin',
                tenant_type: 'none',
                token: 'mock-jwt-token-superadmin',
                user: { id: 0, full_name: 'System Owner', email }
            });
        }

        // Tenant Admin (School) Bypass
        if (email === 'ahmed@school.com') {
            return res.json({
                status: 'success',
                role: 'school',
                tenant_type: 'school',
                token: 'mock-jwt-token-school-admin',
                user: { id: 888, full_name: 'Ahmed (School Admin)', email, tenant_name: 'Test School' }
            });
        }

        // Test User End-User Dashboard Bypass
        if (email === 'user@test.com') {
            return res.json({
                status: 'success',
                role: 'user', // Basic user role
                tenant_type: 'none', // Prevents it from routing to 'school' or 'hotel' dashboard
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

        res.json({
            status: 'success',
            role: user.role, // e.g., 'user', 'admin'
            tenant_type: user.tenant_type, // 'school', 'hotel'
            token: `mock-jwt-token-${user.id}`,
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

module.exports = router;
