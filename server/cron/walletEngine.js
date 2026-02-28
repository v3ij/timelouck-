const cron = require('node-cron');
const pool = require('../config/db');
const { sendSMS } = require('../services/smsService');

// Hourly Rent Amount (For the hotel/apartment leasing concept)
const HOURLY_RENT_AMOUNT = 1500; // UGX 1,500

/**
 * The Time Wallet Engine
 * Runs every minute for testing/demo purposes.
 * In production, it would run periodically (e.g. hourly '0 * * * *').
 */
const startEngine = () => {
    cron.schedule('* * * * *', async () => {
        const client = await pool.connect();
        let processedWallets = 0;
        let smsAlertsSent = 0;
        let locksDisabled = 0;

        try {
            await client.query('BEGIN');

            console.log(`[Time Wallet Engine] Running deduction cycle...`);

            // 1. Fetch Wallets connected to Hotel/Apartment tenants where the user role is not 'admin'
            const activeWalletsResult = await client.query(`
                SELECT w.id as wallet_id, w.user_id, w.balance_ugx, u.full_name, t.name as tenant_name
                FROM wallets w
                JOIN users u ON w.user_id = u.id
                JOIN tenants t ON u.tenant_id = t.id
                WHERE t.type IN ('hotel', 'apartment') 
                  AND w.status = 'active'
                  AND u.role = 'user'
                  FOR UPDATE
            `);

            const wallets = activeWalletsResult.rows;

            for (const wallet of wallets) {
                processedWallets++;
                const newBalance = parseFloat(wallet.balance_ugx) - HOURLY_RENT_AMOUNT;

                // 2. Perform Deduction
                await client.query(
                    'UPDATE wallets SET balance_ugx = $1, last_deduction_at = CURRENT_TIMESTAMP WHERE id = $2',
                    [newBalance, wallet.wallet_id]
                );

                // 3. Record the System Transaction
                await client.query(
                    'INSERT INTO transactions (wallet_id, amount, transaction_type, reference_code) VALUES ($1, $2, $3, $4)',
                    [wallet.wallet_id, -HOURLY_RENT_AMOUNT, 'hourly_rent', 'SYS_AUTO_DEDUCT']
                );

                // 4. Zero/Negative Balance Enforcement Logic
                if (newBalance <= 0) {
                    locksDisabled++;
                    smsAlertsSent++;

                    // Note: Instead of updating devices table which affects all users, 
                    // in a real system we'd manage logical access tokens or flags per user.
                    // For the demo concept, the 'verify' endpoint already checks wallet > 0.

                    // Send SMS Warning (Wrapped in try/catch to prevent server crash on SMS failure)
                    try {
                        await sendSMS(
                            "0700000000", // User Phone (mocked)
                            `TIMELOCK ALERT: Dear ${wallet.full_name}, your Time Wallet balance is UGX ${newBalance}. Your door access has been restricted. Top up immediately.`
                        );
                    } catch (smsError) {
                        console.error(`[Time Wallet Engine] SMS Service Failed for ${wallet.user_id}: `, smsError.message);
                        // Do not throw; let the cron job continue for other users.
                    }
                }
            }

            await client.query('COMMIT');
            console.log(`[Time Wallet Engine] Cycle Complete | Processed: ${processedWallets} | Disabled: ${locksDisabled} | SMS Actions: ${smsAlertsSent}`);

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('[Time Wallet Engine] Critical Error in Job:', error);
        } finally {
            client.release();
        }
    });

    console.log('[Time Wallet Engine] Cron service initialized and ticking.');
};

module.exports = {
    startEngine
};
