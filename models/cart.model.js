// models/cart.model.js
const mongoose = require('mongoose');


require('./auth.model');
require('./product.model');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    size: {
      type: String,
      required: [true, 'Size is required'],
      enum: {
        values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        message: '{VALUE} is not a valid size',
      },
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity cannot be less than 1'],
      default: 1,
    },
    price: {
      type: Number,
      required: [true, 'Price snapshot is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: [true, 'Cart must belong to a user'],
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);


cartSchema.pre('save', function () {
  this.totalAmount = (this.items || []).reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 0;
    return sum + price * qty;
  }, 0);
});

module.exports = mongoose.model('Cart', cartSchema);