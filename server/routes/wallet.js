const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * POST /api/wallet/topup
 * Financial Engine
 * Processes a top-up transaction from Mobile Money (MTN/Airtel).
 */
router.post('/topup', async (req, res) => {
    const { user_id, amount, reference_code } = req.body;

    if (!user_id || !amount) {
        return res.status(400).json({ status: 'error', message: 'Missing required parameters.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Find Wallet
        const walletResult = await client.query('SELECT id, balance_ugx FROM wallets WHERE user_id = $1 FOR UPDATE', [user_id]);

        if (walletResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 'error', message: 'Wallet not found.' });
        }

        const wallet = walletResult.rows[0];

        // 2. Add Funds
        await client.query(
            'UPDATE wallets SET balance_ugx = balance_ugx + $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [amount, wallet.id]
        );

        // 3. Record Transaction
        await client.query(
            'INSERT INTO transactions (wallet_id, amount, transaction_type, reference_code) VALUES ($1, $2, $3, $4)',
            [wallet.id, amount, 'topup', reference_code]
        );

        await client.query('COMMIT');
        return res.status(200).json({ status: 'success', message: `Successfully topped up UGX ${amount}` });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Topup error:', error);
        return res.status(500).json({ status: 'error', message: 'Transaction failed.' });
    } finally {
        client.release();
    }
});

/**
 * POST /api/wallet/deduct-daily-rent
 * Financial Engine (Micro-Leasing)
 * Deducts daily rent from a specific wallet.
 */
router.post('/deduct-daily-rent', async (req, res) => {
    const { user_id, amount } = req.body;

    if (!user_id || !amount) {
        return res.status(400).json({ status: 'error', message: 'Missing required parameters.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Find Wallet
        const walletResult = await client.query('SELECT id, balance_ugx FROM wallets WHERE user_id = $1 FOR UPDATE', [user_id]);

        if (walletResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 'error', message: 'Wallet not found.' });
        }

        const wallet = walletResult.rows[0];

        if (parseFloat(wallet.balance_ugx) < amount) {
            await client.query('ROLLBACK');
            return res.status(402).json({ status: 'error', message: 'Insufficient funds for daily rent.' });
        }

        // 2. Deduct Funds
        await client.query(
            'UPDATE wallets SET balance_ugx = balance_ugx - $1, last_deduction_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [amount, wallet.id]
        );

        // 3. Record Transaction
        await client.query(
            'INSERT INTO transactions (wallet_id, amount, transaction_type) VALUES ($1, $2, $3)',
            [wallet.id, -Math.abs(amount), 'daily_rent']
        );

        await client.query('COMMIT');
        return res.status(200).json({ status: 'success', message: `Successfully deducted daily rent of UGX ${amount}` });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Rent deduction error:', error);
        return res.status(500).json({ status: 'error', message: 'Transaction failed.' });
    } finally {
        client.release();
    }
});

/**
 * GET /api/wallet/balance/:userId
 * Retrieves the current balance and details of a user's wallet.
 */
router.get('/balance/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Find the wallet and tenant details
        const result = await pool.query(`
            SELECT w.id, w.status, u.full_name, t.name as tenant_name 
            FROM wallets w
            JOIN users u ON w.user_id = u.id
            JOIN tenants t ON u.tenant_id = t.id
            WHERE w.user_id = $1
        `, [userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Wallet not found' });
        }

        const walletData = result.rows[0];

        // Ensure Data Integrity: Calculate the precise balance directly from the transaction ledger
        const sumResult = await pool.query(`
            SELECT COALESCE(SUM(amount), 0) as exact_balance 
            FROM transactions 
            WHERE wallet_id = $1
        `, [walletData.id]);

        const exactBalance = Number(sumResult.rows[0].exact_balance);

        // Auto-correct the denormalized wallet table if there is a discrepancy (optional but good for consistency)
        await pool.query('UPDATE wallets SET balance_ugx = $1 WHERE id = $2', [exactBalance, walletData.id]);

        walletData.balance_ugx = exactBalance; // Serve the absolute source-of-truth

        return res.status(200).json({ status: 'success', data: walletData, wallet: walletData });
    } catch (error) {
        console.error('Fetch balance error:', error);
        return res.status(500).json({ status: 'error', message: 'Failed to fetch balance.' });
    }
});

module.exports = router;
