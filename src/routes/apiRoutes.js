const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const lockController = require('../controllers/lockController');
const authController = require('../controllers/authController');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/reset-password', authController.resetPassword);
router.put('/user/profile', authenticateToken, authController.updateProfile);

// Wallet Routes
router.get('/wallet/balance', authenticateToken, walletController.getBalance);
router.post('/wallet/topup', authenticateToken, walletController.addFunds);
router.post('/wallet/pay', authenticateToken, walletController.purchasePackage);
router.get('/wallet/transactions', authenticateToken, walletController.getTransactions);

// Lock Routes
// Lock/Access Routes
router.post('/lock/unlock', authenticateToken, lockController.unlockDoor);
router.post('/unlock', authenticateToken, lockController.unlockDoor);
router.post('/unlock', authenticateToken, lockController.unlockDoor);
router.post('/access/biometric', authenticateToken, lockController.biometricAccess);
router.get('/logs', authenticateToken, lockController.getAccessLogs);

// Notification Routes
const notificationController = require('../controllers/notificationController');
router.get('/notifications', authenticateToken, notificationController.getNotifications);
router.put('/notifications/:id/read', authenticateToken, notificationController.markAsRead);

// Finance Routes (Admin Only usually, but open for now as per minimal auth spec)
const financeController = require('../controllers/financeController');
const dashboardController = require('../controllers/dashboardController');

// Finance Routes
router.get('/finance/stats', authenticateToken, financeController.getDashboardStats);
router.get('/finance/tax-settings', authenticateToken, financeController.getTaxSettings);
router.put('/finance/tax-settings', authenticateToken, financeController.updateTaxSettings);

// Admin Dashboard Routes
router.get('/dashboard/admin-stats', authenticateToken, dashboardController.getAdminStats);

module.exports = router;
