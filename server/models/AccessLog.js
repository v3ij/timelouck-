const mongoose = require('mongoose');

const accessLogSchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Nullable if unknown user
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['Granted', 'Denied'], required: true },
  method: { type: String, enum: ['Biometric', 'RFID', 'App', 'Pin'], required: true },
  
  details: { type: String } // e.g., "Insufficient Funds" or "locked"
});

module.exports = mongoose.model('AccessLog', accessLogSchema);
