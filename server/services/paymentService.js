// server/services/paymentService.js

/**
 * Mocks Mobile Money Payment (MTN/Airtel)
 * @param {string} phone - User phone number
 * @param {number} amount - Amount to charge
 */
exports.initiatePayment = async (phone, amount) => {
    console.log(`[PAYMENT MOCK] Initiating charge of UGX ${amount} to ${phone}`);
    // In production, integrate with YoPayments or Flutterwave
    return { 
        status: 'pending', 
        transactionId: 'TXN-' + Math.floor(Math.random() * 1000000),
        message: 'Push notification sent to user device.'
    };
};
