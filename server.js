require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`\n🔔 New Request: ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes); // Mounts all routes under /api (e.g., /api/login, /api/wallet/balance)
// Fallback for direct /register or /login if frontend calls them directly without /api prefix (though vite proxy points to /api)
// But to be safe with user's previous code:
app.use('/api/v1/auth', apiRoutes);
app.use('/api/hardware', require('./src/routes/hardwareRoutes'));

// Start Hardware Socket Server
// Start Hardware Socket Server (Skip on Vercel/Serverless)
if (!process.env.VERCEL) {
  const tuyaLockService = require('./src/services/TuyaLockService');
  tuyaLockService.start();
}

// Health Check
app.get('/', (req, res) => res.send('Cortex Smart Lock API - v2.0'));

// Only listen if run directly (not required as a module)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;