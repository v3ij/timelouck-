const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Start a Session
router.post('/start', async (req, res) => {
    const { userId, deviceId } = req.body;
    if (!userId || !deviceId) {
        return res.status(400).json({ status: 'error', message: 'Missing userId or deviceId' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if there is already an active session
        const existingSession = await client.query(
            'SELECT * FROM active_sessions WHERE user_id = $1 AND status = $2',
            [userId, 'active']
        );
        if (existingSession.rows.length > 0) {
            await client.query('COMMIT');
            return res.json({
                status: 'success',
                message: 'Session already active',
                data: existingSession.rows[0]
            });
        }

        // Validate user's current wallet balance (must be > 0)
        const walletResult = await client.query(
            'SELECT * FROM wallets WHERE user_id = $1',
            [userId]
        );
        if (walletResult.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ status: 'error', message: 'Wallet not found' });
        }

        const wallet = walletResult.rows[0];
        if (parseFloat(wallet.balance_ugx) <= 0) {
            await client.query('COMMIT');
            return res.status(400).json({
                status: 'error',
                message: 'Insufficient wallet balance. Please top up your MTN/Airtel Wallet.'
            });
        }

        // Create new active session
        const newSessionResult = await client.query(
            'INSERT INTO active_sessions (user_id, device_id, status) VALUES ($1, $2, $3) RETURNING *',
            [userId, deviceId, 'active']
        );
        const session = newSessionResult.rows[0];

        // Simulate remote lock override
        await client.query(
            'UPDATE devices SET is_online = true WHERE id = $1',
            [deviceId]
        );

        // Record an access log
        await client.query(
            'INSERT INTO access_logs (user_id, device_id, status, details) VALUES ($1, $2, $3, $4)',
            [userId, deviceId, 'granted', 'Lease session started - Lock Override']
        );

        // Record a real notification for the Live Stream
        await client.query(
            'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
            [userId, 'Smart Lock lease started. Door unlocked successfully.']
        );

        await client.query('COMMIT');
        res.json({
            status: 'success',
            message: 'Smart Lock Unlocked! Session started.',
            data: session
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error starting session:', error);
        res.status(500).json({ status: 'error', message: 'Failed to start session' });
    } finally {
        client.release();
    }
});

// Calculate Live Active Costs
router.get('/active/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const sessionResult = await pool.query(
            'SELECT s.*, d.device_name FROM active_sessions s JOIN devices d ON s.device_id = d.id WHERE s.user_id = $1 AND s.status = $2',
            [userId, 'active']
        );
        if (sessionResult.rows.length === 0) {
            return res.json({ status: 'inactive' });
        }

        const session = sessionResult.rows[0];
        const elapsedSeconds = Math.max(0, Math.floor((new Date() - new Date(session.start_time)) / 1000));
        // Rate: UGX 25 per minute (or 25/60 = 0.416 UGX per second)
        const currentCost = Math.round((elapsedSeconds / 60) * 25);

        res.json({
            status: 'active',
            data: {
                ...session,
                elapsed_seconds: elapsedSeconds,
                current_cost: currentCost,
                rate_description: 'UGX 25 / min'
            }
        });
    } catch (error) {
        console.error('Error fetching active session:', error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

// Stop a Session
router.post('/stop', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({ status: 'error', message: 'Missing userId' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch active session
        const sessionResult = await client.query(
            'SELECT * FROM active_sessions WHERE user_id = $1 AND status = $2',
            [userId, 'active']
        );
        if (sessionResult.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ status: 'error', message: 'No active session found' });
        }

        const session = sessionResult.rows[0];
        const elapsedSeconds = Math.max(0, Math.floor((new Date() - new Date(session.start_time)) / 1000));
        const finalCost = Math.max(25, Math.ceil((elapsedSeconds / 60) * 25)); // minimum UGX 25

        // Update active session
        await client.query(
            'UPDATE active_sessions SET end_time = CURRENT_TIMESTAMP, accumulated_cost = $1, status = $2 WHERE id = $3',
            [finalCost, 'completed', session.id]
        );

        // Fetch user wallet
        const walletResult = await client.query('SELECT * FROM wallets WHERE user_id = $1', [userId]);
        if (walletResult.rows.length === 0) {
            await client.query('COMMIT');
            return res.status(404).json({ status: 'error', message: 'Wallet not found' });
        }
        const wallet = walletResult.rows[0];
        const newBalance = Math.max(0, parseFloat(wallet.balance_ugx) - finalCost);

        // Deduct from wallet
        await client.query(
            'UPDATE wallets SET balance_ugx = $1 WHERE id = $2',
            [newBalance, wallet.id]
        );

        // Record double-entry transaction ledger
        await client.query(
            'INSERT INTO transactions (wallet_id, amount, transaction_type, reference_code) VALUES ($1, $2, $3, $4)',
            [wallet.id, -finalCost, 'micro_billing', `SESSION_STOP_${session.id}`]
        );

        // Record exit in access log
        await client.query(
            'INSERT INTO access_logs (user_id, device_id, status, details) VALUES ($1, $2, $3, $4)',
            [userId, session.device_id, 'granted', `Lease session stopped. Duration: ${Math.round(elapsedSeconds/60)}m, Cost: UGX ${finalCost}`]
        );

        // Record a real notification for the Live Stream
        await client.query(
            'INSERT INTO notifications (user_id, message) VALUES ($1, $2)',
            [userId, `Smart Lock lease completed. Duration: ${Math.round(elapsedSeconds/60)}m. Billed UGX ${finalCost}.`]
        );

        await client.query('COMMIT');
        res.json({
            status: 'success',
            message: 'Session stopped and billed successfully',
            data: {
                elapsed_minutes: Math.round(elapsedSeconds / 60),
                cost: finalCost,
                new_balance: newBalance
            }
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error stopping session:', error);
        res.status(500).json({ status: 'error', message: 'Failed to stop session' });
    } finally {
        client.release();
    }
});

module.exports = router;
