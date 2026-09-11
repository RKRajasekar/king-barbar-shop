const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Generate unique booking number
const generateBookingNumber = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const year = new Date().getFullYear();
  return `KB-${year}-${code}`;
};

// Create new appointment booking
const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { serviceId, date, timeSlot, notes } = req.body;

    if (!serviceId || !date || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Service ID, appointment date, and time slot are required.',
      });
    }

    // Verify service exists and is active
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    });

    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'The selected service is unavailable.',
      });
    }

    // Check if the selected date is a blocked date / holiday
    const isBlocked = await prisma.blockedDate.findUnique({
      where: { date: date },
    });

    if (isBlocked) {
      return res.status(400).json({
        success: false,
        message: `The salon is closed on ${date}${isBlocked.reason ? ` (${isBlocked.reason})` : ''}. Please choose another date.`,
      });
    }

    // Check if slot is already booked on that date
    const existingBooking = await prisma.booking.findFirst({
      where: {
        date: date,
        timeSlot: timeSlot,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: `The ${timeSlot} slot on ${date} has already been reserved. Please select another time slot.`,
      });
    }

    // Generate unique booking number
    let bookingNumber = generateBookingNumber();
    let isUnique = false;
    while (!isUnique) {
      const existing = await prisma.booking.findUnique({ where: { bookingNumber } });
      if (!existing) {
        isUnique = true;
      } else {
        bookingNumber = generateBookingNumber();
      }
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        bookingNumber,
        userId,
        serviceId: service.id,
        date: date,
        timeSlot: timeSlot,
        notes: notes ? notes.trim() : null,
        status: 'CONFIRMED', // Instant auto-confirmation for seamless experience
        totalAmount: service.price,
      },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      booking,
    });
  } catch (error) {
    console.error('Create Booking Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment booking.',
      error: error.message,
    });
  }
};

// Get bookings of logged-in customer
const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = { userId };
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: true,
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Get My Bookings Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer bookings.',
    });
  }
};

// Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Ensure only the booking owner or an admin can access
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this booking.',
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Get Booking By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details.',
    });
  }
};

// Cancel customer booking
const cancelBooking = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Permission check
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this booking.',
      });
    }

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.',
      });
    }

    if (booking.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Completed bookings cannot be cancelled.',
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
      include: {
        service: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Cancel Booking Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking.',
    });
  }
};

// Get available slots for a given date
const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date query parameter is required (format: YYYY-MM-DD).',
      });
    }

    // Check if the salon is closed on this date
    const blocked = await prisma.blockedDate.findUnique({
      where: { date },
    });

    if (blocked) {
      return res.status(200).json({
        success: true,
        date,
        isClosed: true,
        reason: blocked.reason || 'Salon is closed on this date',
        slots: [],
      });
    }

    // Fetch active time slots
    const allSlots = await prisma.timeSlot.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });

    // Fetch active bookings for this date
    const bookedAppointments = await prisma.booking.findMany({
      where: {
        date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
      select: {
        timeSlot: true,
      },
    });

    const bookedSlotSet = new Set(bookedAppointments.map((b) => b.timeSlot));

    const slotsWithAvailability = allSlots.map((slot) => {
      const isBooked = bookedSlotSet.has(slot.startTime);
      return {
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: !isBooked,
      };
    });

    return res.status(200).json({
      success: true,
      date,
      isClosed: false,
      totalSlots: slotsWithAvailability.length,
      availableCount: slotsWithAvailability.filter((s) => s.isAvailable).length,
      slots: slotsWithAvailability,
    });
  } catch (error) {
    console.error('Get Available Slots Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch available time slots.',
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAvailableSlots,
};
