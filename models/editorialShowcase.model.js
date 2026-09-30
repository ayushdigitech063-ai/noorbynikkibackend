const mongoose = require('mongoose');

const editorialShowcaseSchema = new mongoose.Schema(
  {
    // Section Header
    tagline: {
      type: String,
      trim: true,
    },
    headingPart1: {
      type: String,
      trim: true,
    },
    headingPart2: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Left Bento Card (Mughal/Pichwai Art)
    leftCard: {
      badge: { type: String, trim: true },
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      image: {
        type: String,
        required: [true, 'Left showcase image is mandatory'],
        trim: true,
        validate: {
          validator: function (v) {
            return /^(https?:\/\/|\/)/.test(v);
          },
          message: 'Left card image must be a valid URL or path',
        },
      },
      buttonText: { type: String, trim: true },
      buttonLink: { type: String, trim: true },
    },

    // Right Top Card (Muse Visual)
    rightTopCard: {
      badge: { type: String, trim: true },
      title: { type: String, trim: true },
      image: {
        type: String,
        required: [true, 'Right top showcase image is mandatory'],
        trim: true,
        validate: {
          validator: function (v) {
            return /^(https?:\/\/|\/)/.test(v);
          },
          message: 'Right top card image must be a valid URL or path',
        },
      },
      link: { type: String, trim: true },
    },

    // Right Bottom Card (Quote Section)
    rightBottomCard: {
      quoteHeadingPart1: { type: String, trim: true },
      quoteHeadingPart2: { type: String, trim: true },
      description: { type: String, trim: true },
      backgroundColor: { type: String, trim: true, default: '#5C1A34' },
    },

    // Trust Highlights (Bottom 4 Cards)
    trustHighlights: [
      {
        iconName: { type: String, trim: true },
        title: { type: String, trim: true },
        description: { type: String, trim: true },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EditorialShowcase', editorialShowcaseSchema);