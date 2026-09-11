const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all time slots
const getAllSlots = async (req, res) => {
  try {
    const slots = await prisma.timeSlot.findMany({
      orderBy: { id: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: slots.length,
      slots,
    });
  } catch (error) {
    console.error('Get Slots Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch time slots.',
    });
  }
};

// Create new time slot (Admin)
const createSlot = async (req, res) => {
  try {
    const { startTime, endTime, isActive } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Start time and end time are required.',
      });
    }

    const slot = await prisma.timeSlot.create({
      data: {
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Time slot created successfully.',
      slot,
    });
  } catch (error) {
    console.error('Create Slot Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create time slot.',
    });
  }
};

// Toggle slot active status (Admin)
const toggleSlot = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid slot ID.' });
    }

    const slot = await prisma.timeSlot.findUnique({ where: { id } });
    if (!slot) {
      return res.status(404).json({ success: false, message: 'Time slot not found.' });
    }

    const updated = await prisma.timeSlot.update({
      where: { id },
      data: { isActive: !slot.isActive },
    });

    return res.status(200).json({
      success: true,
      message: `Slot ${updated.isActive ? 'enabled' : 'disabled'} successfully.`,
      slot: updated,
    });
  } catch (error) {
    console.error('Toggle Slot Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update time slot.',
    });
  }
};

// Delete time slot (Admin)
const deleteSlot = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid slot ID.' });
    }

    await prisma.timeSlot.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Time slot deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Slot Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete time slot.',
    });
  }
};

// Get blocked dates
const getBlockedDates = async (req, res) => {
  try {
    const dates = await prisma.blockedDate.findMany({
      orderBy: { date: 'asc' },
    });

    return res.status(200).json({
      success: true,
      blockedDates: dates,
    });
  } catch (error) {
    console.error('Get Blocked Dates Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blocked dates.',
    });
  }
};

// Add blocked date (Admin)
const addBlockedDate = async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required (YYYY-MM-DD).',
      });
    }

    const blocked = await prisma.blockedDate.upsert({
      where: { date },
      update: { reason: reason ? reason.trim() : null },
      create: {
        date,
        reason: reason ? reason.trim() : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Date blocked successfully.',
      blockedDate: blocked,
    });
  } catch (error) {
    console.error('Add Blocked Date Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to block date.',
    });
  }
};

// Remove blocked date (Admin)
const removeBlockedDate = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID.' });
    }

    await prisma.blockedDate.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Date unblocked successfully.',
    });
  } catch (error) {
    console.error('Remove Blocked Date Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unblock date.',
    });
  }
};

module.exports = {
  getAllSlots,
  createSlot,
  toggleSlot,
  deleteSlot,
  getBlockedDates,
  addBlockedDate,
  removeBlockedDate,
};
