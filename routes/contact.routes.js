const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');

const {
  getContactInfo,
  updateContactInfo,
  createInquiry,
  getAllInquiries,
  getInquiryById,
} = require('../controllers/contact.controller');

// Public endpoints
router.get('/info', getContactInfo);
router.post('/inquiry', createInquiry);

// Admin endpoints
router.put('/info',protect, authorize('admin'), updateContactInfo);
router.get('/inquiries',protect, authorize('admin'), getAllInquiries);      
router.get('/inquiries/:id',protect, authorize('admin'), getInquiryById);     
module.exports = router;