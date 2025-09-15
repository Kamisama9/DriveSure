const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Create new booking
router.post('/', bookingController.createBooking);

// // Get all bookings
// router.get('/', bookingController.getBookings);

// // Get specific booking by ID
// router.get('/:id', bookingController.getBooking);

module.exports = router;