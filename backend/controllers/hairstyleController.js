const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all hairstyles with optional category filter
const getAllHairstyles = async (req, res) => {
  try {
    const { category } = req.query;

    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }

    const hairstyles = await prisma.hairstyle.findMany({
      where,
      orderBy: { id: 'asc' },
    });

    return res.status(200).json({
      success: true,
      count: hairstyles.length,
      hairstyles,
    });
  } catch (error) {
    console.error('Get Hairstyles Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hairstyles.',
      error: error.message,
    });
  }
};

// Get single hairstyle
const getHairstyleById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid hairstyle ID.' });
    }

    const hairstyle = await prisma.hairstyle.findUnique({
      where: { id },
    });

    if (!hairstyle) {
      return res.status(404).json({ success: false, message: 'Hairstyle not found.' });
    }

    return res.status(200).json({
      success: true,
      hairstyle,
    });
  } catch (error) {
    console.error('Get Hairstyle By ID Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hairstyle details.',
    });
  }
};

// Create new hairstyle (Admin)
const createHairstyle = async (req, res) => {
  try {
    const { name, category, description, image, recommendedServiceId } = req.body;

    if (!name || !category || !description || !image) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, description, and image URL are required.',
      });
    }

    const hairstyle = await prisma.hairstyle.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        image: image.trim(),
        recommendedServiceId: recommendedServiceId ? parseInt(recommendedServiceId) : null,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Hairstyle added successfully.',
      hairstyle,
    });
  } catch (error) {
    console.error('Create Hairstyle Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create hairstyle.',
    });
  }
};

// Delete hairstyle (Admin)
const deleteHairstyle = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid hairstyle ID.' });
    }

    await prisma.hairstyle.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Hairstyle removed successfully.',
    });
  } catch (error) {
    console.error('Delete Hairstyle Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete hairstyle.',
    });
  }
};

module.exports = {
  getAllHairstyles,
  getHairstyleById,
  createHairstyle,
  deleteHairstyle,
};
