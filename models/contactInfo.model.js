const mongoose = require('mongoose');

const ContactInfoSchema = new mongoose.Schema({

  location: {
    title: { type: String, default: 'Our Location' },
    companyName: { type: String, default: 'Sumit Digitech Pvt Ltd' },
    country: { type: String, default: 'India' },
    fullAddress: { type: String, default: '' }
  },
  phoneSupport: {
    title: { type: String, default: 'Phone & Support' },
    phone: { type: String, default: '+91 83859 73582' },
    workingHours: { type: String, default: 'Mon - Sat: 9:00 AM - 7:00 PM' }
  },
  emailUs: {
    title: { type: String, default: 'Email Us' },
    supportEmail: { type: String, default: 'support@sumitdigitech.com' },
    infoEmail: { type: String, default: 'info@sumitdigitech.com' }
  },
  // Form right side banner
//   sideBanner: {
//     badge: { type: String, default: 'EXCLUSIVE EXPERIENCE' },
//     title: { type: String, default: 'Discover Handcrafted Perfection' },
//     imageUrl: { type: String, default: '/contact-model.png' }
//   },
 
  mapEmbedUrl: { 
    type: String, 
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.5!2d75.8!3d26.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMlDCsDU0JzAwLjAiTiA3NcKwNDgnMDAuMCJF!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin' 
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactInfo', ContactInfoSchema);