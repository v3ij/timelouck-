const User = require('../models/User');
const Device = require('../models/Device');
const AccessLog = require('../models/AccessLog');
const smsService = require('../services/smsService');

// POST /api/hardware/verify
// Body: { macAddress, fingerPrintId, rfidTag }
exports.verifyAccess = async (req, res) => {
    try {
        const { macAddress, fingerPrintId, rfidTag } = req.body;

        // 1. Find Device
        // const device = await Device.findOne({ macAddress });
        // if (!device) return res.status(404).json({ action: "DENY", reason: "Unknown Device" });

        // 2. Find User
        // const query = rfidTag ? { rfidTag } : { biometricHash: fingerPrintId };
        // const user = await User.findOne(query);
        
        // MOCK USER FOR NOW
        const user = { 
            name: "John Doe", 
            walletBalance: 5000, 
            status: 'Active',
            id: 'mock-user-id'
        };

        if (!user || user.status !== 'Active') {
            // Log Denial
            // await AccessLog.create({ status: 'Denied', details: 'User suspect', ... });
            return res.status(403).json({ action: "DENY", reason: "Access Restricted" });
        }

        // 3. Check Wallet Balance (Example: 500 UGX per entry)
        const FEE = 500;
        if (user.walletBalance < FEE) {
            return res.status(402).json({ action: "DENY", reason: "Insufficient Funds" });
        }

        // 4. Deduct Balance (Atomic Logic needed here)
        user.walletBalance -= FEE;
        // await user.save();

        // 5. Log Success
        // await AccessLog.create({ 
        //   tenantId: device.tenantId, userId: user.id, deviceId: device.id, 
        //   status: 'Granted', method: rfidTag ? 'RFID' : 'Biometric' 
        // });

        console.log(`[HARDWARE] Access Granted to ${user.name}. New Balance: ${user.walletBalance}`);

        return res.json({ 
            action: "UNLOCK", 
            message: `Welcome ${user.name}`, 
            remainingBalance: user.walletBalance 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ action: "DENY", reason: "Server Error" });
    }
};
