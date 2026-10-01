const mongoose = require('mongoose');
const Wishlist = require('../models/wishList.model');
const Product = require('../models/product.model');

const getUserWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user: new mongoose.Types.ObjectId(userId) })
    .populate({
      path: 'products',
      select: 'title slug price discountPrice images fabric color sizes inStock totalStock isActive',
      match: { isActive: true },
    })
    .lean();

  return wishlist?.products || [];
};

const toggleWishlistItem = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error('Invalid Product ID');
    error.statusCode = 400;
    throw error;
  }

  const cleanUserId = new mongoose.Types.ObjectId(userId);
  const cleanProductId = new mongoose.Types.ObjectId(productId);

  const product = await Product.findOne({ _id: cleanProductId, isActive: true }).select('_id');
  if (!product) {
    const error = new Error('Product not found or inactive');
    error.statusCode = 404;
    throw error;
  }

  const alreadyWishlisted = await Wishlist.exists({
    user: cleanUserId,
    products: cleanProductId,
  });

  if (alreadyWishlisted) {
    await Wishlist.updateOne(
      { user: cleanUserId },
      { $pull: { products: cleanProductId } }
    );
    return { isWishlisted: false, message: 'Product removed from wishlist' };
  } else {
    await Wishlist.updateOne(
      { user: cleanUserId },
      { $addToSet: { products: cleanProductId } },
      { upsert: true }
    );
    return { isWishlisted: true, message: 'Product added to wishlist' };
  }
};

const removeItemFromWishlist = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    const error = new Error('Invalid Product ID');
    error.statusCode = 400;
    throw error;
  }

  const cleanUserId = new mongoose.Types.ObjectId(userId);
  const cleanProductId = new mongoose.Types.ObjectId(productId);

  // MongoDB update chala kar modifiedCount check karte hain
  const result = await Wishlist.updateOne(
    { user: cleanUserId, products: cleanProductId }, // Sirf tabhi match karega agar product array me hai
    { $pull: { products: cleanProductId } }
  );

  // Agar matchedCount ya modifiedCount 0 hai, matlab product tha hi nahi
  if (result.matchedCount === 0) {
    const error = new Error('Product not found in your wishlist');
    error.statusCode = 404;
    throw error;
  }

  return { message: 'Item removed from wishlist successfully' };
};
module.exports = {
  getUserWishlist,
  toggleWishlistItem,
  removeItemFromWishlist,
};