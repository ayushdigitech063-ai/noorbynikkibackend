const wishlistService = require('../services/wishList.services');

const getAuthUserId = (req) => req.user?._id || req.user?.id || req.user?.userId;

exports.getWishlist = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const items = await wishlistService.getUserWishlist(userId);
    return res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch wishlist',
    });
  }
};

exports.toggleWishlist = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const result = await wishlistService.toggleWishlistItem(userId, productId);
    return res.status(200).json({
      success: true,
      message: result.message,
      isWishlisted: result.isWishlisted,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update wishlist',
    });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { productId } = req.params;
    const result = await wishlistService.removeItemFromWishlist(userId, productId);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove from wishlist',
    });
  }
};