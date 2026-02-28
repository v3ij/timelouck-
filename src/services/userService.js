const db = require('../config/db');
const bcrypt = require('bcrypt');

class UserService {
    async registerUser(userData) {
        const client = await db.getClient();

        try {
            await client.query('BEGIN'); // Start Transaction

            // 1. Hash Password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(userData.password, salt);

            // 2. Create User
            const userQuery = `
        INSERT INTO users (full_name, email, password_hash, role, phone_number)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, full_name, role, email;
      `;
            const userRes = await client.query(userQuery, [
                userData.fullName,
                userData.email,
                passwordHash,
                userData.role,
                userData.phone
            ]);
            const newUser = userRes.rows[0];

            // 3. Auto-Create Time Wallet (Critical for Billing)
            const walletQuery = `
        INSERT INTO wallets (user_id, balance, currency, status)
        VALUES ($1, 0.00, 'UGX', 'Active');
      `;
            await client.query(walletQuery, [newUser.id]);

            await client.query('COMMIT'); // Commit changes
            return newUser;

        } catch (error) {
            await client.query('ROLLBACK'); // Undo if anything fails
            throw error; // Pass error to Controller
        } finally {
            client.release(); // Release connection back to pool
        }
    }
}

module.exports = new UserService();
