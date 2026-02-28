const User = require('../models/User');
const paymentService = require('../services/paymentService');

// POST /api/wallet/deduct
exports.deductBalance = async (req, res) => {
    const { userId, amount, reason } = req.body;
    
    // Validations...
    // const user = await User.findById(userId);
    // if (user.walletBalance < amount) return res.status(400).json({ error: 'Low balance' });
    
    // Update logic...
    // user.walletBalance -= amount;
    // await user.save();

    console.log(`[WALLET] Deducted ${amount} from User ${userId} for ${reason}`);
    res.json({ success: true, newBalance: 4500 });
};

// POST /api/wallet/topup
exports.topUp = async (req, res) => {
    const { userId, amount, phone } = req.body;
    
    // Call Mobile Money API
    const result = await paymentService.initiatePayment(phone, amount);
    
    res.json(result);
};
