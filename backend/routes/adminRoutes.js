const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllCustomers,
  toggleCustomerStatus,
  getCustomerDetails,
} = require('../controllers/adminController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// All admin routes require valid JWT and role === 'ADMIN'
router.use(authenticate, requireAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerDetails);
router.patch('/customers/:id/toggle', toggleCustomerStatus);

module.exports = router;
