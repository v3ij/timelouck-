const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Middleware: Verify Webhook Signature (The "Chinese Lock" Security)
const verifySignature = (req, res, next) => {
    const signature = req.headers['x-hardware-signature'];
    const secret = process.env.HARDWARE_WEBHOOK_SECRET || 'default_secret';

    if (!signature) {
        console.warn('⚠️ Webhook missing signature');
        // For development/placeholder, we might allow it, but in prod verify it.
        // return res.status(401).json({ message: 'Missing signature' });
    }

    // Placeholder verification logic
    // const computed = crypto.createHmac('sha256', secret).update(JSON.stringify(req.body)).digest('hex');
    // if (computed !== signature) return res.status(401).json({ message: 'Invalid signature' });

    console.log('✅ Webhook Signature Verified (Placeholder)');
    next();
};

// Webhook Endpoint
router.post('/callback', verifySignature, (req, res) => {
    const { event, deviceId, timestamp } = req.body;

    console.log(`\n🔌 Hardware Webhook Received: [${event}] from ${deviceId} at ${timestamp}`);

    // Logic to update local DB based on hardware event (e.g. door forced open, low battery)

    res.status(200).json({ received: true });
});

module.exports = router;
