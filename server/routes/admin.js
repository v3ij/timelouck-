const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/admin/super
 * Fetches aggregate stats for the SuperAdmin Dashboard
 */
router.get('/super', async (req, res) => {
    try {
        const tenantsResult = await pool.query('SELECT COUNT(*) FROM tenants');
        const usersResult = await pool.query('SELECT COUNT(*) FROM users');
        const activeLocksResult = await pool.query('SELECT COUNT(*) FROM devices WHERE is_online = true');
        const revenueResult = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE transaction_type = 'topup'");

        res.json({
            status: 'success',
            data: {
                totalTenants: parseInt(tenantsResult.rows[0].count),
                totalUsers: parseInt(usersResult.rows[0].count),
                activeLocks: parseInt(activeLocksResult.rows[0].count),
                totalRevenueUgx: parseFloat(revenueResult.rows[0].total)
            }
        });
    } catch (error) {
        console.error('SuperAdmin stats error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch admin stats' });
    }
});

/**
 * GET /api/admin/tenant/:tenantId
 * Fetches specific stats for a Tenant (School or Hotel)
 */
router.get('/tenant/:tenantId', async (req, res) => {
    const { tenantId } = req.params;
    try {
        const usersResult = await pool.query('SELECT COUNT(*) FROM users WHERE tenant_id = $1', [tenantId]);

        // Count low balances (e.g., < 2000 UGX)
        const lowBalanceResult = await pool.query(`
            SELECT COUNT(*) FROM wallets w
            JOIN users u ON w.user_id = u.id
            WHERE u.tenant_id = $1 AND w.balance_ugx < 2000
        `, [tenantId]);

        const activeLocksResult = await pool.query('SELECT COUNT(*) FROM devices WHERE tenant_id = $1 AND is_online = true', [tenantId]);

        // Sum today's revenue/rent collected for this tenant
        const dailyRentResult = await pool.query(`
            SELECT COALESCE(SUM(t.amount), 0) as total 
            FROM transactions t
            JOIN users u ON t.wallet_id = u.id -- Will correctly link since wallet corresponds to user
            WHERE u.tenant_id = $1 AND t.transaction_type = 'daily_rent' AND t.created_at >= CURRENT_DATE
        `, [tenantId]);

        res.json({
            status: 'success',
            data: {
                totalUsers: parseInt(usersResult.rows[0].count),
                lowBalanceUsers: parseInt(lowBalanceResult.rows[0].count),
                activeLocks: parseInt(activeLocksResult.rows[0].count),
                dailyRentCollectedUgx: Math.abs(parseFloat(dailyRentResult.rows[0].total)) // Rent is stored as negative
            }
        });
    } catch (error) {
        console.error('Tenant stats error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch tenant stats' });
    }
});

/**
 * GET /api/admin/stats
 * Master Admin Dashboard Stats
 */
router.get('/stats', async (req, res) => {
    try {
        // Total Revenue (Sum of 'deduction' transactions)
        const revenueResult = await pool.query(`SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE transaction_type = 'deduction'`);

        // Active Users (balance > 0)
        const activeUsersResult = await pool.query(`SELECT COUNT(*) FROM wallets WHERE balance_ugx > 0`);

        // Device Status (Total Timmy TL90 locks linked)
        const deviceResult = await pool.query(`SELECT COUNT(*) FROM devices`);

        res.json({
            status: 'success',
            data: {
                totalRevenue: Math.abs(parseFloat(revenueResult.rows[0].total)),
                activeUsers: parseInt(activeUsersResult.rows[0].count),
                totalDevices: parseInt(deviceResult.rows[0].count),
                systemHealth: 98
            }
        });
    } catch (error) {
        console.error('Master Admin Stats error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch admin stats' });
    }
});

/**
 * GET /api/admin/users
 * Master Admin User Management List
 */
router.get('/users', async (req, res) => {
    try {
        const usersResult = await pool.query(`
            SELECT u.id, u.full_name, u.email, w.balance_ugx as balance,
                   (SELECT created_at FROM transactions t WHERE t.wallet_id = w.id ORDER BY created_at DESC LIMIT 1) as last_activity
            FROM users u
            JOIN wallets w ON u.id = w.user_id
            ORDER BY u.created_at DESC
        `);

        res.json({
            status: 'success',
            data: usersResult.rows
        });
    } catch (error) {
        console.error('Admin Users error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch users' });
    }
});

/**
 * POST /api/admin/demo/topup
 * Global Top-up Demo Controller
 */
router.post('/demo/topup', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) return res.status(400).json({ status: 'error', message: 'Invalid amount' });

        await pool.query('UPDATE wallets SET balance_ugx = balance_ugx + $1', [amount]);

        const wallets = await pool.query('SELECT id FROM wallets');
        for (let w of wallets.rows) {
            await pool.query(
                "INSERT INTO transactions (wallet_id, transaction_type, amount, description) VALUES ($1, 'topup', $2, 'Admin Global Recharge')",
                [w.id, amount]
            );
        }

        res.json({ status: 'success', message: `Successfully recharged ${wallets.rowCount} users with UGX ${amount}` });
    } catch (error) {
        console.error('Demo Topup error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to perform global topup' });
    }
});

/**
 * GET /api/admin/tenants
 * List all registered tenants for the SuperAdmin Dashboard
 */
router.get('/tenants', async (req, res) => {
    try {
        const tenantsResult = await pool.query(`
            SELECT id, name, type, created_at, 
                   (SELECT COUNT(*) FROM users WHERE users.tenant_id = tenants.id) as user_count
            FROM tenants
            ORDER BY created_at DESC
        `);

        res.json({
            status: 'success',
            data: tenantsResult.rows
        });
    } catch (error) {
        console.error('Admin Tenants error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch tenants' });
    }
});

module.exports = router;
