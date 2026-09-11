const express = require('express');
const router = express.Router();
const {
  getAllSlots,
  createSlot,
  toggleSlot,
  deleteSlot,
  getBlockedDates,
  addBlockedDate,
  removeBlockedDate,
} = require('../controllers/timeSlotController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public slots list for viewing operating hours
router.get('/', getAllSlots);
router.get('/blocked-dates', getBlockedDates);

// Admin slots & schedule management
router.post('/', authenticate, requireAdmin, createSlot);
router.patch('/:id/toggle', authenticate, requireAdmin, toggleSlot);
router.delete('/:id', authenticate, requireAdmin, deleteSlot);
router.post('/blocked-dates', authenticate, requireAdmin, addBlockedDate);
router.delete('/blocked-dates/:id', authenticate, requireAdmin, removeBlockedDate);

module.exports = router;
