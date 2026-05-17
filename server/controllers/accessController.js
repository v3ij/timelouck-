const pool = require('../config/db');

/**
 * POST /api/access/log
 * Hardware endpoint to request access and log entry/exit.
 */
const logAccess = async (req, res) => {
    const { device_id, access_method, rfid_tag, biometric_data_id } = req.body;

    if (!device_id) {
        return res.status(400).json({ status: 'error', message: 'device_id is required' });
    }

    // Quick validation to ensure device_id is a valid UUID format (prevents Postgres 500 cast errors)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(device_id)) {
        return res.status(400).json({ status: 'error', message: 'device_id must be a valid UUID' });
    }

    if (!rfid_tag && !biometric_data_id) {
        return res.status(400).json({ status: 'error', message: 'rfid_tag or biometric_data_id is required' });
    }

    try {
        // 1. Identify User from user_profiles
        let userQuery;
        let queryValues;

        if (rfid_tag) {
            userQuery = `SELECT user_id, access_status FROM public.user_profiles WHERE rfid_tag = $1 LIMIT 1`;
            queryValues = [rfid_tag];
        } else {
            userQuery = `SELECT user_id, access_status FROM public.user_profiles WHERE biometric_data_id = $1 LIMIT 1`;
            queryValues = [biometric_data_id];
        }

        const userResult = await pool.query(userQuery, queryValues);

        if (userResult.rows.length === 0) {
            // Log denied due to unknown user
            await pool.query(
                `INSERT INTO public.access_logs (device_id, access_method, status) VALUES ($1, $2, 'denied_unknown')`,
                [device_id, access_method || 'unknown']
            );
            return res.status(401).json({ status: 'denied', reason: 'User not found' });
        }

        const profile = userResult.rows[0];
        const userId = profile.user_id;

        // 2. Check access_status
        if (profile.access_status !== 'active') {
            await pool.query(
                `INSERT INTO public.access_logs (device_id, user_id, access_method, status) VALUES ($1, $2, $3, 'denied_inactive')`,
                [device_id, userId, access_method || 'unknown']
            );
            return res.status(403).json({ status: 'denied', reason: 'Access status is inactive' });
        }

        // 3. Check wallet balance
        const walletResult = await pool.query(`SELECT balance_ugx FROM public.wallets WHERE user_id = $1 LIMIT 1`, [userId]);

        if (walletResult.rows.length === 0 || parseFloat(walletResult.rows[0].balance_ugx) < 0) {
            await pool.query(
                `INSERT INTO public.access_logs (device_id, user_id, access_method, status) VALUES ($1, $2, $3, 'denied_balance')`,
                [device_id, userId, access_method || 'unknown']
            );
            return res.status(402).json({ status: 'denied', reason: 'Insufficient wallet balance' });
        }

        // 4. Grant Access
        await pool.query(
            `INSERT INTO public.access_logs (device_id, user_id, access_method, status) VALUES ($1, $2, $3, 'granted')`,
            [device_id, userId, access_method || 'unknown']
        );

        return res.status(200).json({ status: 'granted', message: 'Access granted' });

    } catch (error) {
        console.error('Access check error:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            debug: error.message // Expose the exact DB error for debugging
        });
    }
};

module.exports = {
    logAccess
};
