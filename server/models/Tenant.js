const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['School', 'Hotel'], required: true },
  subscriptionStatus: { type: String, enum: ['Active', 'Inactive', 'Trial'], default: 'Active' },
  contactEmail: { type: String, required: true },
  config: {
    currency: { type: String, default: 'UGX' },
    timezone: { type: String, default: 'Africa/Kampala' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tenant', tenantSchema);
