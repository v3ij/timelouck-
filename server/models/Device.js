const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
  macAddress: { type: String, required: true, unique: true },
  
  // Status
  status: { type: String, enum: ['Online', 'Offline', 'Maintenance'], default: 'Online' },
  batteryLevel: { type: Number, default: 100 },
  lastHeartbeat: { type: Date, default: Date.now },
  
  // Location
  location: { type: String, required: true }, // e.g., "Room 101" or "Main Gate"
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Device', deviceSchema);
