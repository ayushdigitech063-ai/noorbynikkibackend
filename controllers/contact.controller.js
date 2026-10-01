const {
  getContactInfoService,
  updateContactInfoService,
  createInquiryService,
  getAllInquiriesService,
  getInquiryByIdService,
} = require('../services/contact.services');

// GET /api/contact/info
const getContactInfo = async (req, res) => {
  try {
    const data = await getContactInfoService();
    return res.status(200).json({
      success: true,
      message: 'Contact details retrieved successfully',
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error while fetching contact details',
    });
  }
};

// PUT /api/contact/info (Admin)
const updateContactInfo = async (req, res) => {
  try {
    const data = await updateContactInfoService(req.body);
    return res.status(200).json({
      success: true,
      message: 'Contact details updated successfully',
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error while updating contact details',
    });
  }
};

// POST /api/contact/inquiry (Public Lead Submission)
const createInquiry = async (req, res) => {
  try {
    const data = await createInquiryService(req.body);
    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted successfully! We will contact you soon.',
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error while submitting inquiry',
    });
  }
};

// GET /api/contact/inquiries (All Inquiries - Latest First)
const getAllInquiries = async (req, res) => {
  try {
    const result = await getAllInquiriesService(req.query);
    return res.status(200).json({
      success: true,
      message: 'All inquiries fetched successfully (latest first)',
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        pages: result.pages,
        limit: result.limit,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error while fetching inquiries',
    });
  }
};

// GET /api/contact/inquiries/:id (Single Inquiry by ID)
const getInquiryById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getInquiryByIdService(id);
    return res.status(200).json({
      success: true,
      message: 'Inquiry details fetched successfully',
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error while fetching inquiry detail',
    });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo,
  createInquiry,
  getAllInquiries,
  getInquiryById,
};