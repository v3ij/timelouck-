const db = require('../config/db');

exports.getBalance = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query('SELECT wallet_balance FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ balance: result.rows[0].wallet_balance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addFunds = async (req, res) => {
    const client = await db.getClient();
    try {
        const userId = req.user.id;
        const { amount, method } = req.body; // Expect amount and payment method

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        await client.query('BEGIN');

        // 1. Insert Transaction Record
        const insertText = 'INSERT INTO transactions (user_id, amount, type, description) VALUES ($1, $2, $3, $4) RETURNING id';
        const txnRes = await client.query(insertText, [userId, amount, 'TOPUP', `Top Up via ${method || 'Unknown'}`]);
        const transactionId = txnRes.rows[0].id;

        // 1.5 Calculate and Record Tax (Finance Module)
        // We import validly inside function or top level. Let's assume top level require.
        // Actually, to avoid circular dependencies if any, we'll require it inside or just import at top.
        // For simplicity in this replace block, I will assume financeController is required at top. 
        // But wait, I can't easily add 'require' at top with this tool without multiple chunks.
        // I will dynamically require it here for safety.
        const financeController = require('./financeController');
        await financeController.processTransactionTax(client, userId, transactionId, amount);

        // 2. Update User Balance
        const updateText = 'UPDATE users SET wallet_balance = wallet_balance + $1 WHERE id = $2 RETURNING wallet_balance';
        const result = await client.query(updateText, [amount, userId]);

        await client.query('COMMIT');

        res.json({
            message: 'Funds added successfully',
            balance: result.rows[0].wallet_balance
        });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Top Up Error:', err);
        res.status(500).json({ message: 'Transaction failed: ' + err.message });
    } finally {
        client.release();
    }
};

exports.purchasePackage = async (req, res) => {
    const client = await db.getClient();
    try {
        const userId = req.user.id;
        const { amount, description, durationMinutes } = req.body; // Expect durationMinutes

        if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

        await client.query('BEGIN');

        // Check Balance
        const userRes = await client.query('SELECT wallet_balance, access_expiry FROM users WHERE id = $1', [userId]);
        const currentBalance = parseFloat(userRes.rows[0].wallet_balance);
        let currentExpiry = userRes.rows[0].access_expiry ? new Date(userRes.rows[0].access_expiry) : new Date();

        // If expiry is in the past, reset to now
        if (currentExpiry < new Date()) {
            currentExpiry = new Date();
        }

        if (currentBalance < amount) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: 'Insufficient Funds' });
        }

        // Calculate New Expiry
        if (durationMinutes) {
            currentExpiry.setMinutes(currentExpiry.getMinutes() + parseInt(durationMinutes));
        }

        // Deduct & Update Expiry
        const updateRes = await client.query(`
            UPDATE users 
            SET wallet_balance = wallet_balance - $1, 
                access_expiry = $2 
            WHERE id = $3 
            RETURNING wallet_balance, access_expiry
        `, [amount, currentExpiry, userId]);

        // Log
        await client.query('INSERT INTO transactions (user_id, amount, type, description) VALUES ($1, $2, $3, $4)',
            [userId, -amount, 'PURCHASE', description || 'Access Time Purchase']
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Purchase successful',
            balance: updateRes.rows[0].wallet_balance,
            access_expiry: updateRes.rows[0].access_expiry
        });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ message: 'Purchase failed' });
    } finally {
        client.release();
    }
};

exports.getTransactions = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query('SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
        res.json({ transactions: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
