const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { sendSMS } = require('../services/smsService');

/**
 * POST /api/payment/webhook
 * Mobile Money Payment Gateway Webhook (MTN Uganda / Airtel)
 * Receives payment confirmations from the provider.
 */
router.post('/webhook', async (req, res) => {
    // Expected Payload from the Payment Provider
    const { transaction_id, phone_number, amount_ugx, provider, reference_code } = req.body;

    if (!transaction_id || !amount_ugx || !reference_code) {
        return res.status(400).json({ status: 'error', message: 'Invalid payload. Missing required fields.' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log(`[Webhook Received] Processing ${provider} payment for Wallet Ref: ${reference_code}`);

        // 1. Verify existence of the Wallet via reference_code
        // Assuming reference_code is the wallet_id for direct top-ups.
        const walletResult = await client.query(`
            SELECT w.id as wallet_id, w.balance_ugx, w.user_id, u.tenant_id, u.full_name
            FROM wallets w
            JOIN users u ON w.user_id = u.id
            WHERE w.id = $1 FOR UPDATE
        `, [reference_code]);

        if (walletResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 'error', message: 'Wallet / Reference Code not found.' });
        }

        const wallet = walletResult.rows[0];

        // 2. Add Funds to the Wallet
        const newBalance = parseFloat(wallet.balance_ugx) + parseFloat(amount_ugx);
        await client.query(
            'UPDATE wallets SET balance_ugx = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [newBalance, wallet.wallet_id]
        );

        // 3. Insert Transaction Record
        await client.query(
            'INSERT INTO transactions (wallet_id, amount, transaction_type, reference_code) VALUES ($1, $2, $3, $4)',
            [wallet.wallet_id, amount_ugx, 'topup', transaction_id]
        );

        // 4. Unlock Associated Devices if the balance was <= 0
        if (parseFloat(wallet.balance_ugx) <= 0) {
            // Re-enabling access for the user. 
            // In a mature system with hardware, this might queue an MQTT message to the lock.
            // Here, we ensure the 'devices' table shows online status if they were soft-locked (based on project requested logic)
            // Note: Normally devices aren't locked per user in the DB this way, but we follow the requested action closely.
            await client.query(
                `UPDATE devices SET is_online = true WHERE tenant_id = $1`,
                [wallet.tenant_id]
            );
            console.log(`[Access Control] Unlocked devices for tenant ${wallet.tenant_id} as wallet is now positive.`);
        }

        // 5. Send Notification via SMS Service
        await sendSMS(
            phone_number || "0700000000",
            `Payment of UGX ${amount_ugx} received via ${provider || 'Mobile Money'}. Your Time Wallet is topped up (Bal: UGX ${newBalance}) and doors are unlocked.`
        );

        await client.query('COMMIT');

        // Acknowledge receipt to the webhook provider (200 OK is standard)
        return res.status(200).json({ status: 'success', message: 'Webhook processed successfully' });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Webhook processing error:', error);
        return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

module.exports = router;
