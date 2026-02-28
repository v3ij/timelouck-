const db = require('../config/db');

exports.getAdminStats = async (req, res) => {
    try {
        // 1. Total Revenue (Sum of Transactions - Type 'topup')
        // Using 'topup' as the main revenue source for now, or sum of all positive amounts if architecture differs.
        const revenueRes = await db.query("SELECT SUM(amount) as total FROM transactions WHERE type = 'topup'");
        const totalRevenue = parseFloat(revenueRes.rows[0]?.total || 0);

        // 2. Total Users
        const usersRes = await db.query("SELECT COUNT(*) as count FROM users");
        const totalUsers = parseInt(usersRes.rows[0]?.count || 0);

        // 3. Active Locks (Online Status)
        const locksRes = await db.query("SELECT COUNT(*) as count FROM smart_locks WHERE online_status = TRUE");
        const activeLocks = parseInt(locksRes.rows[0]?.count || 0);

        // 4. Recent Transactions (Latest 10)
        const recentTxRes = await db.query(`
            SELECT t.id, t.created_at, t.amount, t.vat_amount, t.net_amount, t.type, u.full_name as user_name
            FROM transactions t
            LEFT JOIN users u ON t.user_id = u.id
            ORDER BY t.created_at DESC
            LIMIT 10
        `);

        // 5. Device Health (List of all locks with battery)
        const devicesRes = await db.query("SELECT id, device_name, model, location, battery_level, online_status FROM smart_locks ORDER BY device_name ASC");

        res.json({
            stats: {
                totalRevenue,
                totalUsers,
                activeLocks
            },
            recentTransactions: recentTxRes.rows,
            devices: devicesRes.rows
        });

    } catch (err) {
        console.error("Dashboard Stats Error:", err);
        res.status(500).json({ message: "Server error fetching dashboard stats" });
    }
};
