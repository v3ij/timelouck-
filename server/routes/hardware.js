const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * POST /api/hardware/verify
 * IoT Endpoint for Timmy Smart Locks
 * Receives mac_address and rfid_tag/biometric data.
 * Checks balance and returns unlock status.
 */
router.post('/verify', async (req, res) => {
    const { mac_address, rfid_tag } = req.body;

    if (!mac_address || !rfid_tag) {
        return res.status(400).json({ status: 'error', message: 'Missing required hardware parameters.' });
    }

    try {
        // 1. Verify Device
        const deviceResult = await pool.query('SELECT id, tenant_id FROM devices WHERE mac_address = $1', [mac_address]);
        if (deviceResult.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Unregistered Device.' });
        }
        const device = deviceResult.rows[0];

        // 2. Find User by RFID
        const userResult = await pool.query('SELECT id FROM users WHERE rfid_tag = $1 AND tenant_id = $2', [rfid_tag, device.tenant_id]);

        if (userResult.rows.length === 0) {
            // Log unauthorized attempt
            await pool.query(
                'INSERT INTO access_logs (device_id, auth_method, status) VALUES ($1, $2, $3)',
                [device.id, 'RFID', 'denied_unauthorized']
            );
            return res.status(403).json({ status: 'denied', reason: 'UNAUTHORIZED_USER' });
        }

        const user = userResult.rows[0];

        // 3. Check Wallet Balance
        const walletResult = await pool.query('SELECT id, balance_ugx FROM wallets WHERE user_id = $1', [user.id]);

        if (walletResult.rows.length === 0 || parseFloat(walletResult.rows[0].balance_ugx) <= 0) {
            // Log denied low balance
            await pool.query(
                'INSERT INTO access_logs (device_id, user_id, auth_method, status) VALUES ($1, $2, $3, $4)',
                [device.id, user.id, 'RFID', 'denied_low_balance']
            );
            return res.status(402).json({ status: 'denied', reason: 'INSUFFICIENT_FUNDS' });
        }

        // 4. Grant Access
        await pool.query(
            'INSERT INTO access_logs (device_id, user_id, auth_method, status) VALUES ($1, $2, $3, $4)',
            [device.id, user.id, 'App', 'granted']
        );

        return res.status(200).json({ status: 'granted', action: 'UNLOCK_DOOR' });

    } catch (error) {
        console.error('Hardware verify error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
});

module.exports = router;
