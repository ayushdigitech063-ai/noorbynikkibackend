const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    position: {
      type: String,
      enum: ['hero', 'festival'],
      default: 'hero',
      required: true,
    },
    badge: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    title: { 
      type: String, 
      required: [true, 'Banner title is required'], 
      trim: true 
    },
    subtitle: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    buttonText: { 
      type: String, 
      trim: true, 
      default: 'SHOP COLLECTION' 
    },
    // link: { 
    //   type: String, 
    //   trim: true, 
    //   default: '/shop' 
    // },
    imageUrl: { 
      type: String, 
      required: [true, 'Banner image is required'] 
    },
    order: { 
      type: Number, 
      default: 0 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);