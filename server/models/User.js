const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  role: { type: String, enum: ['Student', 'Guest', 'Admin'], default: 'Guest' },
  
  // Auth Data
  rfidTag: { type: String, unique: true, sparse: true },
  biometricHash: { type: String }, // Encrypted fingerprint template
  passwordHash: { type: String },
  
  // Wallet
  walletBalance: { type: Number, default: 0 },
  currency: { type: String, default: 'UGX' },
  
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
