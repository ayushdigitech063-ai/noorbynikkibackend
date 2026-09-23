// models/address.schema.js
const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      minlength: [5, 'Street address must be at least 5 characters long'],
      maxlength: [150, 'Street address cannot exceed 150 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true
    },
    postalCode: {
      type: String,
      required: [true, 'PIN / Postal code is required'],
      trim: true,
      match: [/^[1-9][0-9]{5}$/, 'Please provide a valid 6-digit PIN code']
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Delivery contact number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian mobile number']
    },
    addressType: {
      type: String,
      enum: ['Home', 'Work', 'Other'],
      default: 'Home'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  },
  {
    _id: true,
    timestamps: false
  }
);

module.exports = addressSchema;