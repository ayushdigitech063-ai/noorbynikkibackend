const ContactInfo = require('../models/contactInfo.model');
const ContactInquiry = require('../models/contactInquiry.model');

// 1. Fetch Contact Info (Location, Phone, Email, Map)
const getContactInfoService = async () => {
  let info = await ContactInfo.findOne();
  if (!info) {
    info = await ContactInfo.create({
      location: {
        title: 'Our Location',
        companyName: 'Sumit Digitech Pvt Ltd',
        country: 'India',
      },
      phoneSupport: {
        title: 'Phone & Support',
        phone: '+91 83859 73582',
        workingHours: 'Mon - Sat: 9:00 AM - 7:00 PM',
      },
      emailUs: {
        title: 'Email Us',
        supportEmail: 'support@sumitdigitech.com',
        infoEmail: 'info@sumitdigitech.com',
      },
    });
  }
  return info;
};

// 2. Update Contact Info (Admin)
const updateContactInfoService = async (updateData) => {
  let info = await ContactInfo.findOne();
  if (!info) {
    info = await ContactInfo.create(updateData);
  } else {
    Object.assign(info, updateData);
    await info.save();
  }
  return info;
};

// 3. User Form Submission (Create Inquiry)
const createInquiryService = async ({ name, email, phone, message }) => {
  if (!name || !email || !phone || !message) {
    const error = new Error('All fields (name, email, phone, message) are required');
    error.statusCode = 400;
    throw error;
  }

  const inquiry = await ContactInquiry.create({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    message: message.trim(),
  });

  return inquiry;
};

// 4. Fetch All Inquiries (Latest First: createdAt -1)
const getAllInquiriesService = async (query = {}) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, parseInt(query.limit) || 10);
  const skip = (page - 1) * limit;

  const filter = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.search && query.search.trim()) {
    const searchRegex = new RegExp(query.search.trim(), 'i');
    filter.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { phone: searchRegex },
    ];
  }

  const [total, inquiries] = await Promise.all([
    ContactInquiry.countDocuments(filter),
    ContactInquiry.find(filter)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return {
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
    data: inquiries,
  };
};

// 5. Fetch Single Inquiry by ID
const getInquiryByIdService = async (inquiryId) => {
  if (!inquiryId) {
    const error = new Error('Inquiry ID is required');
    error.statusCode = 400;
    throw error;
  }

  const inquiry = await ContactInquiry.findById(inquiryId).lean();
  if (!inquiry) {
    const error = new Error('Inquiry not found with this ID');
    error.statusCode = 404;
    throw error;
  }

  return inquiry;
};

module.exports = {
  getContactInfoService,
  updateContactInfoService,
  createInquiryService,
  getAllInquiriesService,
  getInquiryByIdService,
};