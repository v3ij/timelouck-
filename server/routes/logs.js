const express = require('express');
const router = express.Router();
const pool = require('../config/db');

/**
 * GET /api/logs/me
 * Returns a unified timeline of recent unlocks, deductions, and top-ups for the user.
 * It combines data from `access_logs` and `transactions` tables.
 */
router.get('/me', async (req, res) => {
    // In a real app we extract user_id from JWT payload. 
    // Here we read it from Headers as a mock-auth step (passed by frontend)
    const userId = req.headers['x-user-id'] || 999;

    try {
        const unifiedLogsQuery = `
            SELECT 
                al.id as source_id,
                'access' as type,
                'Access Granted' as title,
                CONCAT(d.device_name, ' - ', d.model) as subtitle,
                NULL as amount,
                al.created_at
            FROM access_logs al
            JOIN devices d ON al.device_id = d.id
            WHERE al.user_id = $1 AND al.status = 'granted'
            
            UNION ALL
            
            SELECT 
                t.id as source_id,
                CASE 
                    WHEN t.transaction_type = 'hourly_rent' THEN 'deduction'
                    WHEN t.transaction_type = 'topup' THEN 'topup'
                    ELSE 'transaction'
                END as type,
                CASE 
                    WHEN t.transaction_type = 'hourly_rent' THEN 'Time Deduction'
                    WHEN t.transaction_type = 'topup' THEN 'Top-up Successful'
                    ELSE 'Wallet Update'
                END as title,
                CASE 
                    WHEN t.transaction_type = 'hourly_rent' THEN 'Hourly Rate Applied'
                    WHEN t.transaction_type = 'topup' THEN 'Mobile Money'
                    ELSE 'General'
                END as subtitle,
                t.amount as amount,
                t.created_at
            FROM transactions t
            JOIN wallets w ON t.wallet_id = w.id
            WHERE w.user_id = $1
            
            ORDER BY created_at DESC
            LIMIT 15;
        `;

        const result = await pool.query(unifiedLogsQuery, [userId]);

        // Map postgres rows to frontend expected format
        const logs = result.rows.map((row, index) => {
            let color, bg, iconStr, formattedAmount;

            if (row.type === 'access') {
                color = 'text-emerald-400';
                bg = 'bg-emerald-400/10';
                iconStr = 'Fingerprint';
                formattedAmount = null;
            } else if (row.type === 'deduction') {
                color = 'text-amber-400';
                bg = 'bg-amber-400/10';
                iconStr = 'Zap';
                formattedAmount = `-${Number(row.amount)} UGX`;
            } else if (row.type === 'topup') {
                color = 'text-blue-400';
                bg = 'bg-blue-400/10';
                iconStr = 'Plus';
                formattedAmount = `+${Number(row.amount)} UGX`;
            }

            return {
                id: `${row.type}-${row.source_id}-${index}`,
                type: row.type,
                title: row.title,
                subtitle: row.subtitle,
                amount: formattedAmount,
                time: row.created_at, // Send raw ISO, format on frontend
                iconStr,
                color,
                bg
            };
        });

        res.json({ status: 'success', logs });

    } catch (error) {
        console.error('Fetch logs error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch logs' });
    }
});

/**
 * GET /api/logs/notifications/:tenantId
 * Retrieves all SMS notifications dispatched for a specific tenant, mapping recipient details.
 */
router.get('/notifications/:tenantId', async (req, res) => {
    const { tenantId } = req.params;
    try {
        const result = await pool.query(`
            SELECT n.id, n.message, n.created_at, n.is_read, u.full_name, u.phone_number
            FROM notifications n
            JOIN users u ON n.user_id = u.id
            WHERE u.tenant_id = $1
            ORDER BY n.created_at DESC
            LIMIT 50
        `, [tenantId]);

        res.json({
            status: 'success',
            data: result.rows.map(row => ({
                id: row.id,
                message: row.message,
                createdAt: row.created_at,
                isRead: row.is_read,
                fullName: row.full_name,
                phoneNumber: row.phone_number || '0700000000',
                costUgx: 50 // UGX 50 per local SMS
            }))
        });
    } catch (error) {
        console.error('Fetch tenant notifications error:', error);
        res.status(500).json({ status: 'error', message: 'Failed to fetch notifications feed' });
    }
});

module.exports = router;
