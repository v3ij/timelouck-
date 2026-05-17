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
        // 1. Verify Device and Fetch Tenant Type
        const deviceResult = await pool.query(`
            SELECT d.id, d.tenant_id, t.type as tenant_type 
            FROM devices d
            JOIN tenants t ON d.tenant_id = t.id
            WHERE d.mac_address = $1
        `, [mac_address]);

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

        // 4. Determine Dynamic Sector Messaging & Event Type
        let logMetadata = { direction: "In" }; // Default to Time In
        let sectorMessage = "Access Granted.";

        if (device.tenant_type === 'school') {
            sectorMessage = `Student Arrived`;
            logMetadata.event = "Student Check-In";
            logMetadata.activity = "Academic Attendance";
        } else if (device.tenant_type === 'hotel') {
            sectorMessage = `Guest Room Entry`;
            logMetadata.event = "Room Accessed";
            logMetadata.activity = "Hospitality Stay";
        } else if (device.tenant_type === 'apartment') {
            sectorMessage = `Welcome Home`;
            logMetadata.event = "Apartment Entry";
            logMetadata.activity = "Residential Access";
        }

        // 5. Grant Access
        await pool.query(
            'INSERT INTO access_logs (device_id, user_id, auth_method, status, metadata) VALUES ($1, $2, $3, $4, $5)',
            [device.id, user.id, 'App', 'granted', JSON.stringify(logMetadata)]
        );

        return res.status(200).json({ status: 'granted', action: 'UNLOCK_DOOR', message: sectorMessage });

    } catch (error) {
        console.error('Hardware verify error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal server error.' });
    }
});

/**
 * POST /api/hardware/override
 * Manual Remote Override Signal for Admin Dashboards
 * Triggers socket opendoor signal to simulated hardware and updates status logs.
 */
router.post('/override', async (req, res) => {
    const { deviceId, reason } = req.body;
    if (!deviceId) return res.status(400).json({ status: 'error', message: 'Device ID required for remote override.' });

    try {
        // Fetch device details
        const deviceRes = await pool.query('SELECT * FROM devices WHERE id = $1', [deviceId]);
        if (deviceRes.rows.length === 0) return res.status(404).json({ status: 'error', message: 'Device not found.' });
        const device = deviceRes.rows[0];

        // Trigger remote override to WebSocket server if connected
        const tuyaLockService = require('../../src/services/TuyaLockService');
        const socketResult = await tuyaLockService.unlockDoor(device.mac_address);

        // Insert log of manual override
        await pool.query(`
            INSERT INTO access_logs (device_id, user_id, auth_method, status, metadata)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            device.id,
            null, // Initiated by admin override
            'Manual Remote Override',
            'granted',
            JSON.stringify({ 
                event: 'Remote Override', 
                activity: 'Manual Admin Unlock', 
                reason: reason || 'Remote assistance requested',
                socket_delivered: socketResult.success
            })
        ]);

        return res.json({
            status: 'success',
            message: `Override command successfully dispatched. Device: ${device.device_name}`,
            socket_delivered: socketResult.success
        });
    } catch (err) {
        console.error('Remote override error:', err);
        return res.status(500).json({ status: 'error', message: 'Failed to dispatch manual override command.' });
    }
});

module.exports = router;
