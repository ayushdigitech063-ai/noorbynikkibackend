const mongoose = require('mongoose');
const Product = require('../models/product.model');
const Category = require('../models/category.model');
const { deleteFromCloudinary } = require('../config/cloudinary');

// Helper: Escape special characters for safe search
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// 1. Master Query Handler (Get Products with Filters, Search, Sort & Pagination)
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
    // String ko space ke basis par todte hain: "white anarkali" -> ["white", "anarkali"]
    const terms = search.trim().split(/\s+/).filter(Boolean);

    // Har single word ke liye check
    const termConditions = await Promise.all(
      terms.map(async (term) => {
        const regexPattern = { $regex: escapeRegex(term),$options: 'i' };

        // Check if this term matches any category name
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
  // Filter: Size variant availability
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

  // Filter: Overall Stock
  if (inStock === 'true' || inStock === true) {
    conditions.push({ totalStock: { $gt: 0 } });
  }

  // Filter: Price Range
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

  // Sorting
  let sortOptions = { createdAt: -1 };
  if (sort === 'price-low') sortOptions = { price: 1 };
  if (sort === 'price-high') sortOptions = { price: -1 };
  if (sort === 'oldest') sortOptions = { createdAt: 1 };

  // Pagination
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

// 3. Create Product
const createProduct = async (productData) => {
  // Validate that the category exists
  const categoryExists = await Category.findById(productData.category);
  if (!categoryExists) {
    const error = new Error('Selected category does not exist');
    error.statusCode = 404;
    throw error;
  }

  const newProduct = new Product(productData);
  // .save() executes pre-save hook for slug and totalStock calculation
  await newProduct.save();

  return await Product.findById(newProduct._id)
    .populate('category', 'name slug')
    .lean();
};

// 4. Update Product (Uses .save() to guarantee totalStock auto-recalculation)
const updateProduct = async (id, updateData, newImages = []) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Validate category if updating
  if (updateData.category && updateData.category.toString() !== product.category.toString()) {
    const categoryExists = await Category.findById(updateData.category);
    if (!categoryExists) {
      const error = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
  }

  // Merge updated images if provided
  if (newImages.length > 0) {
    updateData.images = [...(product.images || []), ...newImages];
  }

  // Clean up removed images if client sent deletedImages list
  if (updateData.deletedImages && Array.isArray(updateData.deletedImages)) {
    for (const imgUrl of updateData.deletedImages) {
      await deleteFromCloudinary(imgUrl);
    }
    updateData.images = (updateData.images || product.images).filter(
      (img) => !updateData.deletedImages.includes(img)
    );
  }

  // Apply updates to the Mongoose document
  Object.assign(product, updateData);

  // Calling .save() ensures pre-save hooks execute totalStock & slug changes
  await product.save();

  return await Product.findById(id)
    .populate('category', 'name slug')
    .lean();
};

// 5. Delete Product with Cloudinary Cleanup
const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Delete all linked images from Cloudinary
  if (product.images && product.images.length > 0) {
    for (const imgUrl of product.images) {
      await deleteFromCloudinary(imgUrl);
    }
  }

  await Product.findByIdAndDelete(id);
  return { message: 'Product deleted successfully' };
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
};