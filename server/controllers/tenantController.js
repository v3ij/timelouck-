const Device = require('../models/Device');
const AccessLog = require('../models/AccessLog');

// GET /api/tenant/:tenantId/stats
exports.getStats = async (req, res) => {
    const { tenantId } = req.params;

    // Mock Aggregation
    const stats = {
        activeLocks: 48,
        totalRevenue: 1250000,
        todayEntries: 142
    };

    // Real logic would be:
    // const activeLocks = await Device.countDocuments({ tenantId, status: 'Online' });
    // const logs = await AccessLog.countDocuments({ tenantId, timestamp: { $gte: today } });

    res.json(stats);
};

// GET /api/tenant/:tenantId/devices
exports.getDevices = async (req, res) => {
    // const devices = await Device.find({ tenantId: req.params.tenantId });
    const devices = [
        { id: 101, status: 'Online', battery: 85, location: 'Room 101' },
        { id: 102, status: 'Offline', battery: 10, location: 'Room 102' }
    ];
    res.json(devices);
};
