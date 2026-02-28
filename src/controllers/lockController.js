const db = require('../config/db');

exports.unlockDoor = async (req, res) => {
    const client = await db.getClient();
    try {
        const userId = req.user.id;
        const { doorId, amount } = req.body;
        const DEDUCTION_AMOUNT = amount || 5.00; // Default to 5.00 if not sent

        await client.query('BEGIN');

        // 1. Check Balance & User Existence
        const userRes = await client.query('SELECT wallet_balance FROM users WHERE id = $1', [userId]);

        if (userRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const currentBalance = parseFloat(userRes.rows[0].wallet_balance);

        if (currentBalance < DEDUCTION_AMOUNT) {
            await client.query('ROLLBACK');
            return res.status(400).json({ success: false, message: `Insufficient Funds (Req: ${DEDUCTION_AMOUNT})` });
        }

        // 2. Deduct Balance
        await client.query('UPDATE users SET wallet_balance = wallet_balance - $1 WHERE id = $2', [DEDUCTION_AMOUNT, userId]);

        // 3. Log Transaction
        await client.query(
            "INSERT INTO transactions (user_id, type, amount, description, status) VALUES ($1, 'PAYMENT', $2, 'Unlock Fee', 'COMPLETED')",
            [userId, -DEDUCTION_AMOUNT]
        );

        // 4. Log Access
        await client.query(
            "INSERT INTO access_logs (user_id, door_id, method, status) VALUES ($1, $2, 'APP', 'GRANTED')",
            [userId, doorId || 'DOOR_001']
        );

        await client.query('COMMIT');

        console.log(`⚡ UNLOCK SUCCESS: User ${userId} | -${DEDUCTION_AMOUNT}`);

        // Simulate hardware delay
        setTimeout(() => {
            res.json({ success: true, message: "Access Granted" });
        }, 500);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Unlock Logic Failed:", err);
        res.status(500).json({ success: false, message: "Transaction Failed" });
    } finally {
        client.release();
    }
};

exports.biometricAccess = async (req, res) => {
    const userId = req.user.id;
    try {
        // 1. Check if user has biometrics enabled
        const userRes = await db.query('SELECT biometric_enabled FROM users WHERE id = $1', [userId]);
        if (!userRes.rows.length || !userRes.rows[0].biometric_enabled) {
            return res.status(403).json({ success: false, message: "Biometric authentication not enabled for this user." });
        }

        // 2. Simulate Hardware Handshake (2s)
        console.log(`🧬 BIOMETRIC HANDSHAKE INITIATED: User ${userId}`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 3. Log Access
        await db.query('INSERT INTO access_logs (user_id, method, status) VALUES ($1, $2, $3)', [userId, 'BIOMETRIC', 'SUCCESS']);

        res.json({ success: true, message: "Biometric Signal Verified via Server" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server handshake failed" });
    }
};

exports.getAccessLogs = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await db.query('SELECT * FROM access_logs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json({ logs: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
