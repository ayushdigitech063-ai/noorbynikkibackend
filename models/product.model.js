const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      enum: {
        values: [
          'Anarkali Kurtis',
          'A-Line Kurtis',
          'Classic Kurtis',
          'Printed Kurtis',
          'Party Wear Kurtis',
          'Suit Set Kurtis',
          'Bright',
        ],
        message: '{VALUE} is not a valid kurti category',
      },
      index: true,
    },
    sizes: {
      type: [String],
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      default: ['S', 'M', 'L', 'XL'],
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, 'At least one image URL is required'],
      validate: [(arr) => arr.length > 0, 'Provide at least one image'],
    },
    tag: {
      type: String,
      enum: ['new_arrival', 'bestseller', 'summer_special', 'limited_edition', 'none'],
      default: 'none',
      index: true,
    },
    fabric: {
      type: String,
      default: 'Pure Cotton',
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);


productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug =
      this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Date.now();
  }
  next();
});


productSchema.index({ category: 1, price: 1 });
productSchema.index({ tag: 1, createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);