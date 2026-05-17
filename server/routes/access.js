const express = require('express');
const router = express.Router();
const { logAccess } = require('../controllers/accessController');

// POST /api/access/log
router.post('/log', logAccess);

module.exports = router;
