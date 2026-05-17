const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings } = require('../controllers/bookingController');

router.post('/', createBooking);
router.get('/my-contracts', getMyBookings);

module.exports = router;
