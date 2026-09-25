    const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    badge: {
      type: String,
      trim: true,
      default: 'FESTIVE EDITION 2026',
    },
    title: {
      type: String,
      required: [true, 'Promotion title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    buttonText: {
      type: String,
      trim: true,
      default: 'SHOP COLLECTION',
    },
    whatsappNumber: {
      type: String,
      trim: true,
      default: '919000000000', // Admin contact for inquiry
    },
    imageUrl: {
      type: String,
      required: [true, 'Promotion image is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);