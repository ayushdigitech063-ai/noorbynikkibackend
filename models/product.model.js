const mongoose = require('mongoose');


const ALLOWED_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'FREE SIZE'];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price must be a positive number'],
    },
    images: [
      {
        type: String,
        required: [true, 'At least one product image is required'],
      },
    ],
   
    sizes: {
      type: [
        {
          size: {
            type: String,
            required: [true, 'Size is required'],
            uppercase: true,
            trim: true,
            enum: {
              values: ALLOWED_SIZES,
              message: `{VALUE} is not a valid size. Allowed values: ${ALLOWED_SIZES.join(', ')}`,
            },
          },
          stock: {
            type: Number,
            required: [true, 'Stock for this size is required'],
            default: 0,
            min: [0, 'Stock cannot be negative'],
          },
        },
      ],
      validate: [
        {
          
          validator: function (val) {
            return Array.isArray(val) && val.length > 0;
          },
          message: 'Product must have at least one size variant',
        },
        {
         
          validator: function (val) {
            const sizeNames = val.map((item) => item.size);
            return sizeNames.length === new Set(sizeNames).size;
          },
          message: 'Duplicate sizes are not allowed for the same product',
        },
      ],
    },
    
    totalStock: {
      type: Number,
      default: 0,
      min: [0, 'Total stock cannot be negative'],
    },
    fabric: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isFestivalOffer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.pre('save', function () {
 
  if (this.isModified('sizes') || this.isNew) {
    if (this.sizes && this.sizes.length > 0) {
      this.totalStock = this.sizes.reduce(
        (sum, item) => sum + (Number(item.stock) || 0),
        0
      );
    } else {
      this.totalStock = 0;
    }
  }

  // 2. Slug generation
  if (this.isModified('title')) {
    const baseSlug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    this.slug = `${baseSlug}-${randomSuffix}`;
  }
});

module.exports = mongoose.model('Product', productSchema);