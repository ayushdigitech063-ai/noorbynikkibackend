const cartService = require('../services/cart.services');

const getAuthUserId = (req) => req.user?._id || req.user?.id || req.user?.userId;

exports.getCart = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const cart = await cartService.getCartByUserId(userId);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to fetch cart',
    });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { productId, size, quantity } = req.body;
    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and Size are required',
      });
    }

    const updatedCart = await cartService.addToCart(userId, { productId, size, quantity });
    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to add item to cart',
    });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required',
      });
    }

    const updatedCart = await cartService.updateCartItemQuantity(userId, { itemId, quantity });
    return res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: updatedCart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update quantity',
    });
  }
};

exports.removeItem = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { itemId } = req.params;
    const updatedCart = await cartService.removeCartItem(userId, itemId);

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: updatedCart,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to remove item',
    });
  }
};

exports.clearUserCart = async (req, res) => {
  try {
    const userId = getAuthUserId(req);
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await cartService.clearCart(userId);
    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to clear cart',
    });
  }
};