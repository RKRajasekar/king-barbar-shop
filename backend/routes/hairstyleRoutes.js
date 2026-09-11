const express = require('express');
const router = express.Router();
const {
  getAllHairstyles,
  getHairstyleById,
  createHairstyle,
  deleteHairstyle,
} = require('../controllers/hairstyleController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

// Public lookbook endpoints
router.get('/', getAllHairstyles);
router.get('/:id', getHairstyleById);

// Admin endpoints
router.post('/', authenticate, requireAdmin, createHairstyle);
router.delete('/:id', authenticate, requireAdmin, deleteHairstyle);

module.exports = router;
