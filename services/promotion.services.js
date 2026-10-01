const Promotion = require('../models/promotion.model');
const { deleteFromCloudinary } = require('../config/cloudinary');

const getActivePromotion = async () => {
  return await Promotion.findOne({ isActive: true }).sort({ createdAt: -1 }).lean();
};


const getAllPromotions = async () => {
  return await Promotion.find().sort({ createdAt: -1 }).lean();
};

const createPromotion = async (data) => {
  return await Promotion.create(data);
};


const updatePromotion = async (id, updateData) => {
  const existing = await Promotion.findById(id);
  if (!existing) {
    const error = new Error('Promotion not found');
    error.statusCode = 404;
    throw error;
  }

  if (updateData.imageUrl && existing.imageUrl) {
    await deleteFromCloudinary(existing.imageUrl);
  }

  return await Promotion.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();
};

const deletePromotion = async (id) => {
  const promo = await Promotion.findById(id);
  if (!promo) {
    const error = new Error('Promotion not found');
    error.statusCode = 404;
    throw error;
  }

  if (promo.imageUrl) {
    await deleteFromCloudinary(promo.imageUrl);
  }

  await Promotion.findByIdAndDelete(id);
  return { message: 'Promotion deleted successfully' };
};

module.exports = {
  getActivePromotion,
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
};