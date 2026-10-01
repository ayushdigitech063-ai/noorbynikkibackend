const Category = require('../models/category.model');
const Product = require('../models/product.model');
const { deleteFromCloudinary } = require('../config/cloudinary');


const getActiveCategories = async () => {
  return await Category.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();
};


const getAllCategories = async () => {
  return await Category.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();
};


const checkDuplicateName = async (name, excludeId = null) => {
  const query = { name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } };
  if (excludeId) query._id = { $ne: excludeId };
  
  const exists = await Category.findOne(query);
  if (exists) {
    const error = new Error(`Category with name "${name}" already exists.`);
    error.statusCode = 409;
    throw error;
  }
};


const createCategory = async (data) => {
  return await Category.create(data);
};

const updateCategory = async (id, updateData) => {
  const existing = await Category.findById(id);
  if (!existing) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  
  if (updateData.name) {
    updateData.slug = updateData.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  
  if (updateData.imageUrl && existing.imageUrl) {
    await deleteFromCloudinary(existing.imageUrl);
  }

  return await Category.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();
};


const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.statusCode = 404;
    throw error;
  }

  const linkedCount = await Product.countDocuments({ category: id });
  if (linkedCount > 0) {
    const error = new Error(`Cannot delete. Linked to ${linkedCount} product(s).`);
    error.statusCode = 400;
    throw error;
  }

  if (category.imageUrl) {
    await deleteFromCloudinary(category.imageUrl);
  }

  await Category.findByIdAndDelete(id);
  return { message: 'Category deleted successfully' };
};

module.exports = {
  getActiveCategories,
  getAllCategories,
  checkDuplicateName,
  createCategory,
  updateCategory,
  deleteCategory,
};