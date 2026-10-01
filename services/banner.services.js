const Banner = require('../models/banner.model');

const getActiveBanners = async (position) => {
  const query = { isActive: true };

  if (position) {
    query.position = position;
  }

  return await Banner.find(query)
    .sort({ order: 1, createdAt: -1 })
    .lean();
};

const getAllBanners = async (queryParams = {}) => {
  const query = {};
  if (queryParams.position) {
    query.position = queryParams.position;
  }
  return await Banner.find(query)
    .sort({ order: 1, createdAt: -1 })
    .lean();
};


const createBanner = async (bannerData) => {
  return await Banner.create(bannerData);
};

const updateBanner = async (id, updateData) => {
  const banner = await Banner.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!banner) {
    const error = new Error('Banner not found');
    error.statusCode = 404;
    throw error;
  }
  return banner;
};


const deleteBanner = async (id) => {
  const banner = await Banner.findByIdAndDelete(id).lean();
  if (!banner) {
    const error = new Error('Banner not found');
    error.statusCode = 404;
    throw error;
  }
  return banner;
};

module.exports = {
  getActiveBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};