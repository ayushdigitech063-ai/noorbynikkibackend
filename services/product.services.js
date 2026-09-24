// services/product.services.js
const Product = require('../models/product.model');


const getAllProducts = async (queryParams) => {
  const {
    category,
    tag,
    search,
    sort,
    size,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
  } = queryParams;

  const query = {};

  // 1. Category Filter (exact match)
  if (category) {
    query.category = category;
  }

  // 2. Tag Filter
  if (tag && tag !== 'none') {
    query.tag = tag;
  }

  // 3. Search Filter (Safe Regex: Partial & Case-Insensitive)
  if (search) {
    query.$or = [
      { name: { $regex: search.trim(), $options: 'i' } },
      { description: { $regex: search.trim(), $options: 'i' } },
    ];
  }

  // 4. Size Filter (Agar user specific size dhund raha ho)
  if (size) {
    query.sizes = {
      $elemMatch: {
        size: size.toUpperCase(),
        stock: { $gt: 0 }, // sirf in-stock size dikhaye
      },
    };
  }

  // 5. Price Range Filter (Next.js filter sidebar ke liye)
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 6. Sorting Options
  let sortOption = { createdAt: -1 }; // default newest
  if (sort === 'price-low') sortOption = { price: 1 };
  if (sort === 'price-high') sortOption = { price: -1 };
  if (sort === 'oldest') sortOption = { createdAt: 1 };

  // 7. Pagination
  const pageNum = Math.max(1, parseInt(page, 10));
  const pageSize = Math.max(1, parseInt(limit, 10));
  const skip = (pageNum - 1) * pageSize;

  const [products, total] = await Promise.all([
    Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products,
    meta: {
      total,
      page: pageNum,
      limit: pageSize,
      totalPages: Math.ceil(total / pageSize),
    },
  };
};


const getProductByIdOrSlug = async (identifier) => {

  const isObjectId = identifier.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: identifier } : { slug: identifier };

  const product = await Product.findOne(query).lean();
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return product;
};


const createProduct = async (productData) => {
  return await Product.create(productData);
};


const updateProduct = async (id, updateData) => {
  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!updatedProduct) {
    const error = new Error('Product not found to update');
    error.statusCode = 404;
    throw error;
  }
  return updatedProduct;
};


const deleteProduct = async (id) => {
  const deletedProduct = await Product.findByIdAndDelete(id).lean();
  if (!deletedProduct) {
    const error = new Error('Product not found to delete');
    error.statusCode = 404;
    throw error;
  }
  return deletedProduct;
};

module.exports = {
  getAllProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
};