const express = require('express');
const router = express.Router();
const { getMyProfile, updateMyProfile } = require('../controllers/profileController');

// For simplicity, defining mock auth within the controller 
// using req.headers['x-user-id']

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);

module.exports = router;
