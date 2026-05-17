const pool = require('../config/db');

/**
 * POST /api/bookings
 * Create a new contract/booking linked to a tenant and user wallet.
 */
const createBooking = async (req, res) => {
    const { user_id, tenant_id, contract_type, start_date, end_date, amount, days_weeks_paid, payment_method } = req.body;
    console.log('[DEBUG] createBooking called with:', { user_id, tenant_id, contract_type, amount, payment_method });

    if (!user_id || !tenant_id || !contract_type || !start_date || !amount) {
        return res.status(400).json({ status: 'error', message: 'Missing required booking parameters.' });
    }

    const p_method = payment_method || 'Cash at bank'; // Default to digital transfer if not specified

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Find Wallet and check balance
        const walletResult = await client.query('SELECT id, balance_ugx FROM wallets WHERE user_id = $1 FOR UPDATE', [user_id]);

        if (walletResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ status: 'error', message: 'User wallet not found.' });
        }

        const wallet = walletResult.rows[0];

        if (parseFloat(wallet.balance_ugx) < amount) {
            await client.query('ROLLBACK');
            return res.status(402).json({ status: 'error', message: 'Insufficient wallet balance for this booking.' });
        }

        // 2. Deduct amount from wallet
        await client.query(
            'UPDATE wallets SET balance_ugx = balance_ugx - $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
            [amount, wallet.id]
        );

        // 3. Record the Transaction
        await client.query(
            'INSERT INTO transactions (wallet_id, amount, transaction_type, reference_code, metadata) VALUES ($1, $2, $3, $4, $5::jsonb)',
            [wallet.id, -Math.abs(amount), 'booking_payment', contract_type, JSON.stringify({ payment_method: p_method })]
        );

        // 4. Create the Contract / Booking record
        const bookingResult = await client.query(`
            INSERT INTO contracts_and_bookings 
            (user_id, tenant_id, contract_type, start_date, end_date, status, amount_paid, days_weeks_paid, metadata)
            VALUES ($1, $2, $3, $4, $5, 'active', $6, $7, $8::jsonb)
            RETURNING id
        `, [user_id, tenant_id, contract_type, start_date, end_date || null, amount, days_weeks_paid || 1, JSON.stringify({ payment_method: p_method })]);

        await client.query('COMMIT');

        res.status(201).json({
            status: 'success',
            message: 'Booking created and paid successfully',
            booking_id: bookingResult.rows[0].id
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create booking error:', error.message);
        res.status(500).json({ status: 'error', message: 'Failed to create booking', debug: error.message });
    } finally {
        client.release();
    }
};

/**
 * GET /api/bookings/my-contracts
 * Returns all contracts/bookings for the current user
 */
const getMyBookings = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 999;
        const result = await pool.query(`
            SELECT c.*, t.name as tenant_name, t.type as tenant_type 
            FROM contracts_and_bookings c
            JOIN tenants t ON c.tenant_id = t.id
            WHERE c.user_id = $1
            ORDER BY c.created_at DESC
        `, [userId]);

        res.json({ status: 'success', data: result.rows });
    } catch (error) {
        console.error('Fetch bookings error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch bookings' });
    }
};

module.exports = {
    createBooking,
    getMyBookings
};
