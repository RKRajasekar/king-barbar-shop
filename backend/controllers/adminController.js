const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get aggregated dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Customer count
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' },
    });

    // Services count
    const totalServices = await prisma.service.count();
    const activeServices = await prisma.service.count({ where: { isActive: true } });

    // Today's bookings
    const todayBookings = await prisma.booking.count({
      where: { date: today },
    });

    // Upcoming bookings (today and future)
    const upcomingBookings = await prisma.booking.count({
      where: {
        date: { gte: today },
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    // Completed & Cancelled
    const completedBookings = await prisma.booking.count({
      where: { status: 'COMPLETED' },
    });

    const cancelledBookings = await prisma.booking.count({
      where: { status: 'CANCELLED' },
    });

    const totalBookings = await prisma.booking.count();

    // Total Revenue from completed or confirmed appointments
    const revenueAgg = await prisma.booking.aggregate({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const totalRevenue = revenueAgg._sum.totalAmount || 0;

    // Recent 6 bookings
    const recentBookings = await prisma.booking.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatar: true },
        },
        service: true,
      },
    });

    // Popular Services breakdown
    const servicesWithCount = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        price: true,
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        bookings: { _count: 'desc' },
      },
      take: 5,
    });

    return res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        totalServices,
        activeServices,
        todayBookings,
        upcomingBookings,
        completedBookings,
        cancelledBookings,
        totalBookings,
        totalRevenue,
      },
      recentBookings,
      popularServices: servicesWithCount,
    });
  } catch (error) {
    console.error('Get Dashboard Stats Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard metrics.',
      error: error.message,
    });
  }
};

// Get all bookings with filtering & search
const getAllBookings = async (req, res) => {
  try {
    const { status, date, search } = req.query;

    const where = {};

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (date) {
      where.date = date;
    }

    if (search) {
      where.OR = [
        { bookingNumber: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { service: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, avatar: true },
        },
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
    console.error('Get All Bookings Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings list.',
    });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid booking ID.' });
    }

    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        service: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: `Booking #${booking.bookingNumber} status updated to ${status}.`,
      booking,
    });
  } catch (error) {
    console.error('Update Booking Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update booking status.',
    });
  }
};

// Get all customers with spend and appointment history summary
const getAllCustomers = async (req, res) => {
  try {
    const { search } = req.query;

    const where = { role: 'CUSTOMER' };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const customers = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        bookings: {
          select: {
            id: true,
            status: true,
            totalAmount: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedCustomers = customers.map((c) => {
      const totalBookings = c.bookings.length;
      const completedBookings = c.bookings.filter((b) => b.status === 'COMPLETED').length;
      const totalSpent = c.bookings
        .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      const { bookings, ...customerData } = c;
      return {
        ...customerData,
        totalBookings,
        completedBookings,
        totalSpent,
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedCustomers.length,
      customers: formattedCustomers,
    });
  } catch (error) {
    console.error('Get All Customers Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer directory.',
    });
  }
};

// Toggle customer active status
const toggleCustomerStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID.' });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || user.role === 'ADMIN') {
      return res.status(404).json({ success: false, message: 'Customer account not found.' });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    return res.status(200).json({
      success: true,
      message: `Customer account ${updated.isActive ? 'activated' : 'deactivated'} successfully.`,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        isActive: updated.isActive,
      },
    });
  } catch (error) {
    console.error('Toggle Customer Status Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update customer status.',
    });
  }
};

// Get single customer full profile + booking history
const getCustomerDetails = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid customer ID.' });
    }

    const customer = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        bookings: {
          include: {
            service: true,
          },
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found.' });
    }

    return res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error('Get Customer Details Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch customer profile.',
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllBookings,
  updateBookingStatus,
  getAllCustomers,
  toggleCustomerStatus,
  getCustomerDetails,
};
