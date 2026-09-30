const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const getCartByUserId = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title price discountPrice images sizes totalStock slug isActive',
    match: { isActive: true },
  });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [], totalAmount: 0 });
    return cart;
  }

  const originalCount = cart.items.length;
  cart.items = cart.items.filter((item) => item.product !== null);

  if (cart.items.length !== originalCount) {
    await cart.save();
  }

  return cart;
};

const addToCart = async (userId, { productId, size, quantity = 1 }) => {
  const parsedQty = Number(quantity);
  if (!parsedQty || parsedQty <= 0) {
    const error = new Error('Quantity must be a positive number');
    error.statusCode = 400;
    throw error;
  }

  // Safe size clean
  const cleanSize = String(size || '').trim().toUpperCase();

  const product = await Product.findOne({ _id: productId, isActive: true });
  if (!product) {
    const error = new Error('Product not found or currently unavailable');
    error.statusCode = 404;
    throw error;
  }

  const targetVariant = product.sizes.find(
    (item) => String(item.size).trim().toUpperCase() === cleanSize
  );

  if (!targetVariant) {
    const error = new Error(`Size ${size} is not available for this product`);
    error.statusCode = 400;
    throw error;
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  // ✅ SAFE COMPARISON: Handles both populated object and plain ObjectId
  const existingItemIndex = cart.items.findIndex((item) => {
    const existingProdId = item.product?._id
      ? item.product._id.toString()
      : item.product.toString();

    const existingSize = String(item.size || '').trim().toUpperCase();

    return existingProdId === productId.toString() && existingSize === cleanSize;
  });

  const existingQty = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
  const newTotalQty = existingQty + parsedQty;

  if (newTotalQty > targetVariant.stock) {
    const error = new Error(
      `Only ${targetVariant.stock} items left in stock for size ${size}`
    );
    error.statusCode = 400;
    throw error;
  }

  const effectivePrice = product.discountPrice || product.price;

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity = newTotalQty;
    cart.items[existingItemIndex].price = effectivePrice;
  } else {
    cart.items.push({
      product: productId,
      size: cleanSize,
      quantity: parsedQty,
      price: effectivePrice,
    });
  }

  await cart.save();
  return await getCartByUserId(userId);
};

const updateCartItemQuantity = async (userId, { itemId, quantity }) => {
  const parsedQty = Number(quantity);

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const itemIndex = cart.items.findIndex(
    (item) => item._id.toString() === itemId.toString()
  );

  if (itemIndex === -1) {
    const error = new Error('Item not found in cart');
    error.statusCode = 404;
    throw error;
  }

  if (parsedQty <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    const targetItem = cart.items[itemIndex];
    const product = await Product.findOne({ _id: targetItem.product, isActive: true });

    if (!product) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      const error = new Error('Product is no longer available and has been removed from cart');
      error.statusCode = 404;
      throw error;
    }

    const targetVariant = product.sizes.find(
      (s) => s.size.toUpperCase() === targetItem.size.toUpperCase()
    );

    if (!targetVariant || parsedQty > targetVariant.stock) {
      const available = targetVariant ? targetVariant.stock : 0;
      const error = new Error(
        `Only ${available} items in stock for size ${targetItem.size}`
      );
      error.statusCode = 400;
      throw error;
    }

    cart.items[itemIndex].quantity = parsedQty;
    cart.items[itemIndex].price = product.discountPrice || product.price;
  }

  await cart.save();
  return await getCartByUserId(userId);
};

const removeCartItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item._id.toString() !== itemId.toString()
  );

  if (cart.items.length === initialLength) {
    const error = new Error('Item not found in cart');
    error.statusCode = 404;
    throw error;
  }

  await cart.save();
  return await getCartByUserId(userId);
};

const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  return { items: [], totalAmount: 0 };
};

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
};