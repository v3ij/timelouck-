const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.get('/:tenantId/stats', tenantController.getStats);
router.get('/:tenantId/devices', tenantController.getDevices);

module.exports = router;
