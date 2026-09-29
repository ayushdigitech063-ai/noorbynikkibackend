const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { deleteFromCloudinary } = require('../config/cloudinary');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const getProducts = async (queryParams) => {
  const {
    category,
    search,
    size,
    inStock,
    color,      
    fabric,
    minPrice,
    maxPrice,
    isFeatured,
    isFestivalOffer,
    sort,
    page = 1,
    limit = 20,
  } = queryParams;

  const conditions = [];

  conditions.push({ isActive: true });

  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      conditions.push({ category: new mongoose.Types.ObjectId(category) });
    } else {
      const catDoc = await Category.findOne({ slug: category.toLowerCase().trim() }).select('_id');
      if (catDoc) {
        conditions.push({ category: catDoc._id });
      } else {
        return { total: 0, page: Number(page), pages: 0, data: [] };
      }
    }
  }

  if (color && color.trim()) {
    conditions.push({ 
      color: { $regex: new RegExp(`^${escapeRegex(color.trim())}$`, 'i') } 
    });
  }

  if (fabric && fabric.trim()) {
    conditions.push({ 
      fabric: { $regex: new RegExp(`^${escapeRegex(fabric.trim())}$`, 'i') } 
    });
  }

  if (search && search.trim()) {
    const terms = search.trim().split(/\s+/).filter(Boolean);

    const termConditions = await Promise.all(
      terms.map(async (term) => {
        const regexPattern = { $regex: escapeRegex(term),$options: 'i' };

        const matchedCategories = await Category.find({ name: regexPattern }).select('_id');
        const categoryIds = matchedCategories.map((c) => c._id);

        return {
          $or: [
            { title: regexPattern },
            { description: regexPattern },
            { fabric: regexPattern },
            { color: regexPattern },
            { tags: regexPattern },
            { category: { $in: categoryIds } },
          ],
        };
      })
    );

    conditions.push({ $and: termConditions });
  }

  if (size) {
    conditions.push({
      sizes: {
        $elemMatch: {
          size: size.toUpperCase().trim(),
          stock: { $gt: 0 },
        },
      },
    });
  }

  if (inStock === 'true' || inStock === true) {
    conditions.push({ totalStock: { $gt: 0 } });
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter = {};
    if (minPrice !== undefined) priceFilter.$gte = Number(minPrice);
    if (maxPrice !== undefined) priceFilter.$lte = Number(maxPrice);
    conditions.push({ price: priceFilter });
  }

  if (isFeatured !== undefined) {
    conditions.push({ isFeatured: isFeatured === 'true' || isFeatured === true });
  }
  if (isFestivalOffer !== undefined) {
    conditions.push({ isFestivalOffer: isFestivalOffer === 'true' || isFestivalOffer === true });
  }

  const query = conditions.length > 0 ? { $and: conditions } : {};

  let sortOptions = { createdAt: -1 };
  if (sort === 'price-low') sortOptions = { price: 1 };
  if (sort === 'price-high') sortOptions = { price: -1 };
  if (sort === 'oldest') sortOptions = { createdAt: 1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
  ]);

  return {
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    data: products,
  };
};

const getProductByIdOrSlug = async (identifier) => {
  const isId = mongoose.Types.ObjectId.isValid(identifier);
  const query = isId ? { _id: identifier } : { slug: identifier };

  query.isActive = true;

  const product = await Product.findOne(query)
    .populate('category', 'name slug imageUrl')
    .lean();

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  return product;
};

const createProduct = async (productData) => {
  // 1. Category validation
  const categoryExists = await Category.findById(productData.category);
  if (!categoryExists) {
    const error = new Error('Selected category does not exist');
    error.statusCode = 404;
    throw error;
  }

  // 2. Duplicate Title Check (Case-insensitive)
  if (productData.title) {
    const cleanTitle = productData.title.trim();
    const existingTitle = await Product.findOne({
      title: { $regex: new RegExp(`^${escapeRegex(cleanTitle)}$`, 'i') },
    });

    if (existingTitle) {
      const error = new Error(`Product with title "${cleanTitle}" already exists`);
      error.statusCode = 409; // 409 Conflict
      throw error;
    }
  }

  const newProduct = new Product({
    ...productData,
    title: productData.title ? productData.title.trim() : productData.title,
    isActive: productData.isActive !== undefined ? productData.isActive : true,
  });

  await newProduct.save();

  return await Product.findById(newProduct._id)
    .populate('category', 'name slug')
    .lean();
};
const updateProduct = async (id, updateData, newImages = []) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

 
  if (updateData.title && updateData.title.trim().toLowerCase() !== product.title.toLowerCase()) {
    const cleanTitle = updateData.title.trim();
    const duplicateProduct = await Product.findOne({
      _id: { $ne: id }, // Khud ke ID ko chhodkar baki sabme dhoondo
      title: { $regex: new RegExp(`^${escapeRegex(cleanTitle)}$`, 'i') },
    });

    if (duplicateProduct) {
      const error = new Error(`Another product with title "${cleanTitle}" already exists`);
      error.statusCode = 409;
      throw error;
    }
    updateData.title = cleanTitle;
  }

  if (updateData.category && updateData.category.toString() !== product.category.toString()) {
    const categoryExists = await Category.findById(updateData.category);
    if (!categoryExists) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
  }

  let finalImages = [...(product.images || [])];

  if (newImages.length > 0) {
    finalImages = [...finalImages, ...newImages];
  }

  if (updateData.deletedImages && Array.isArray(updateData.deletedImages)) {
    for (const imgUrl of updateData.deletedImages) {
      await deleteFromCloudinary(imgUrl);
    }
    finalImages = finalImages.filter((img) => !updateData.deletedImages.includes(img));
  }

  delete updateData.deletedImages;
  updateData.images = finalImages;

  Object.assign(product, updateData);

  await product.save();

  return await Product.findById(id)
    .populate('category', 'name slug')
    .lean();
};

const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  product.isActive = false;
  await product.save();

  return { message: 'Product deactivated successfully' };
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
};