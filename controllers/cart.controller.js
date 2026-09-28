const cartService = require("../services/cart.services");

const getUserId = (req) => req.user?._id || req.user?.id || req.user?.userId;

exports.getCart = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const cart = await cartService.getCartByUserId(userId);
    return res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, size, quantity } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: "productId and size are required fields",
      });
    }

    const userId = getUserId(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing from token",
      });
    }
    const cart = await cartService.addToCart(userId, {
      productId,
      size,
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuantity = async (req, res, next) => {
  try {
    const { itemId, quantity } = req.body;

    if (!itemId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "itemId and quantity are required fields",
      });
    }

    const userId = getUserId(req);
    const cart = await cartService.updateCartItemQuantity(userId, {
      itemId,
      quantity,
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = getUserId(req);
    
    const cart = await cartService.removeCartItem(userId, itemId);

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const cart = await cartService.clearCart(userId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
