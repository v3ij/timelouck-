const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.DATABASE_URL) {
    throw new Error('❌ DATABASE_URL missing in .env');
}

const express = require('express');
const cors = require('cors');

const hardwareRoutes = require('./routes/hardware');
const walletRoutes = require('./routes/wallet');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const logsRoutes = require('./routes/logs'); // Unified Activity Feed
const profileRoutes = require('./routes/profiles');
const bookingRoutes = require('./routes/bookings');
const accessRoutes = require('./routes/access');
const { startEngine } = require('./cron/walletEngine');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());

// Routes
app.use('/api/hardware', hardwareRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/access', accessRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({ status: 'Online', system: 'TimeLock Backend API', db_connected: !!process.env.DATABASE_URL });
});

// Start Server
const startServer = async () => {
    try {
        console.log('🔄 Checking database connection...');
        await pool.query('SELECT NOW()');
        console.log('✅ Connected to Neon PostgreSQL database.');




        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);

            // Initialize required background services
            startEngine();
        });
    } catch (error) {
        console.error('❌ Failed to connect to the database. Exiting...', error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
