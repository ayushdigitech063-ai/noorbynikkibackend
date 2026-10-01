const mongoose = require('mongoose');

const ContactInquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'contacted', 'resolved'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('ContactInquiry', ContactInquirySchema);