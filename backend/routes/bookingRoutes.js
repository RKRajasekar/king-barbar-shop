const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAvailableSlots,
} = require('../controllers/bookingController');
const { authenticate } = require('../middleware/authMiddleware');

// Public / client slot availability endpoint
router.get('/slots/availability', getAvailableSlots);

// Authenticated customer booking endpoints
router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getMyBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/cancel', authenticate, cancelBooking);

module.exports = router;
