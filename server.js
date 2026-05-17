require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import modular SaaS routes
const hardwareRoutes = require('./server/routes/hardware');
const walletRoutes = require('./server/routes/wallet');
const paymentRoutes = require('./server/routes/payment');
const adminRoutes = require('./server/routes/admin');
const authRoutes = require('./server/routes/auth');
const logsRoutes = require('./server/routes/logs');
const profileRoutes = require('./server/routes/profiles');
const bookingRoutes = require('./server/routes/bookings');
const accessRoutes = require('./server/routes/access');
const sessionRoutes = require('./server/routes/sessions');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`\n🔔 New Request: ${req.method} ${req.url}`);
  next();
});

// Mount modular SaaS routes
app.use('/api/hardware', hardwareRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/access', accessRoutes);
app.use('/api/sessions', sessionRoutes);

// Fallbacks and legacy support routes
app.use('/api', authRoutes); // Allows direct POST to /api/login, /api/register, /api/forgot-password, /api/reset-password
app.use('/api/v1/auth', authRoutes);

// Start Hardware Socket Server (Skip on Vercel/Serverless)
if (!process.env.VERCEL) {
  const tuyaLockService = require('./src/services/TuyaLockService');
  tuyaLockService.start();
  
  // Start Background Billing & Access Engine (Digital Micro-Leasing)
  console.log("⏱️ Starting digital wallet billing engine...");
  require('./server/cron/walletEngine');
}

// Health Check
app.get('/', (req, res) => res.send('Cortex Smart Lock Unified SaaS API - v2.0'));

// Only listen if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Unified Express Server running on port ${PORT}`);
  });
}

module.exports = app;