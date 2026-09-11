const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all active services (or all if admin requested)
const getAllServices = async (req, res) => {
  try {
    const { category, includeInactive, search } = req.query;

    const where = {};
    if (includeInactive !== 'true') {
      where.isActive = true;
    }
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: [{ category: 'asc' }, { price: 'asc' }],
    });

    return res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error('Get Services Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch services.',
      error: error.message,
    });
  }
};

// Get single service by ID
const getServiceById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID.' });
    }

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    return res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    console.error('Get Service By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch service details.',
    });
  }
};

// Create new service (Admin)
const createService = async (req, res) => {
  try {
    const { name, category, description, price, duration, image, isActive } = req.body;

    if (!name || !description || price === undefined || duration === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and duration are required.',
      });
    }

    const service = await prisma.service.create({
      data: {
        name: name.trim(),
        category: category || 'Haircut',
        description: description.trim(),
        price: parseFloat(price),
        duration: parseInt(duration),
        image: image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80',
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      service,
    });
  } catch (error) {
    console.error('Create Service Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create service.',
      error: error.message,
    });
  }
};

// Update service (Admin)
const updateService = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID.' });
    }

    const { name, category, description, price, duration, image, isActive } = req.body;

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(category && { category: category.trim() }),
        ...(description && { description: description.trim() }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(image !== undefined && { image }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully.',
      service: updated,
    });
  } catch (error) {
    console.error('Update Service Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update service.',
      error: error.message,
    });
  }
};

// Delete service (Admin)
const deleteService = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid service ID.' });
    }

    // Check if there are active bookings for this service
    const activeBookings = await prisma.booking.count({
      where: {
        serviceId: id,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (activeBookings > 0) {
      // Instead of hard deleting, deactivate the service to preserve booking history integrity
      await prisma.service.update({
        where: { id },
        data: { isActive: false },
      });

      return res.status(200).json({
        success: true,
        message: 'Service has active upcoming bookings, so it was set to Inactive instead of permanently deleted.',
      });
    }

    await prisma.service.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Service deleted successfully.',
    });
  } catch (error) {
    console.error('Delete Service Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete service.',
      error: error.message,
    });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
