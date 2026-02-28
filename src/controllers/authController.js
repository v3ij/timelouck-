const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Mock Email Sender (Replace with SendGrid/Resend in production)
const sendEmail = async (to, subject, text) => {
    if (!process.env.SENDGRID_API_KEY) {
        console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
        console.log(`[Mock Email] Content: ${text}`);
        return;
    }
    // TODO: Implement actual email sending
    console.log(`Did not send email to ${to} because logic is hidden.`);
};

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const fullName = req.body.fullName || req.body.name || "User";
        const phone = req.body.phone || "";

        // Check if user exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists, please login' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = await db.query(
            `INSERT INTO users (full_name, email, password_hash, phone, wallet_balance) 
             VALUES ($1, $2, $3, $4, 0.00) RETURNING *`,
            [fullName, email, hashedPassword, phone]
        );

        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        console.log("✅ New user registered:", email);
        res.status(201).json({ token, user: newUser.rows[0] });

    } catch (err) {
        console.error("❌ Registration error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

// ... login function above ...
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expiry = new Date(Date.now() + 3600000); // 1 hour

        // Ensure columns exist (Phase 3 will enforce schema, for now we assume or just log)
        try {
            await db.query(
                'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
                [tokenHash, expiry, email]
            );
        } catch (dbErr) {
            console.warn("DB Schema might be missing reset_token columns:", dbErr.message);
            return res.status(500).json({ message: "Database schema update required for this feature." });
        }

        // Send Email
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
        await sendEmail(email, "Password Reset Request", `Click here to reset: ${resetUrl}`);

        res.json({ message: "Reset link sent to email." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await db.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
            [tokenHash]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await db.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expiry = NULL WHERE id = $2',
            [hashedPassword, user.rows[0].id]
        );

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { biometric_enabled } = req.body;

        if (typeof biometric_enabled !== 'boolean') {
            return res.status(400).json({ message: "Invalid data" });
        }

        const result = await db.query(
            'UPDATE users SET biometric_enabled = $1 WHERE id = $2 RETURNING *',
            [biometric_enabled, userId]
        );

        res.json({ user: result.rows[0], message: "Profile updated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.login = async (req, res) => {
    console.log("Login attempt:", req.body.email);

    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);

        if (user.rows.length === 0) {
            console.log("⚠️ User not found");
            return res.status(400).json({ message: 'Email not registered' });
        }

        // 2. Compare password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            console.log("⚠️ Invalid password");
            return res.status(400).json({ message: 'Invalid password' });
        }

        // 3. Success
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

        console.log("🔓 Login successful:", email);
        res.json({ token, user: user.rows[0] });

    } catch (err) {
        console.error("❌ Server error:", err.message);
        res.status(500).json({ message: "Server error" });
    }
};
