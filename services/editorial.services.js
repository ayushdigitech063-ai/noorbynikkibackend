const EditorialShowcase = require('../models/editorialShowcase.model');
const cloudinaryConfig = require('../config/cloudinary');

// Safe Helper: Check karein config file se upload function mil raha hai ya direct cloudinary instance
const uploadBuffer = async (buffer, folder = 'editorial') => {
  // Case A: Agar config file me pehle se uploadToCloudinary helper bana hua hai
  if (typeof cloudinaryConfig.uploadToCloudinary === 'function') {
    return await cloudinaryConfig.uploadToCloudinary(buffer, folder);
  }

  // Case B: Stream uploader instance
  const cld = cloudinaryConfig.cloudinary || cloudinaryConfig.v2 || cloudinaryConfig;
  return new Promise((resolve, reject) => {
    const stream = cld.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result.secure_url);
    });
    stream.end(buffer);
  });
};

/**
 * 1. Active Editorial Showcase fetch karna
 */
const getEditorialShowcase = async () => {
  return await EditorialShowcase.findOne({ isActive: true }).lean();
};

/**
 * 2. Upsert (Create / Update + Retain Logic)
 */
const upsertEditorialShowcase = async (payload, files, adminUserId) => {
  const existing = await EditorialShowcase.findOne().lean();
  const updateData = { ...payload };

  if (adminUserId) {
    updateData.updatedBy = adminUserId;
  }

  // --- Left Card Image Handling ---
  if (files && files.leftCardImage && files.leftCardImage[0]) {
    const leftUrl = await uploadBuffer(files.leftCardImage[0].buffer, 'editorial/left');
    updateData.leftCard = {
      ...(typeof updateData.leftCard === 'object' ? updateData.leftCard : {}),
      image: leftUrl,
    };
  } else if (payload.leftCard && payload.leftCard.image) {
    updateData.leftCard = {
      ...(typeof updateData.leftCard === 'object' ? updateData.leftCard : {}),
      image: payload.leftCard.image,
    };
  } else if (existing && existing.leftCard && existing.leftCard.image) {
    updateData.leftCard = {
      ...(typeof updateData.leftCard === 'object' ? updateData.leftCard : {}),
      image: existing.leftCard.image,
    };
  }

  // --- Right Top Card Image Handling ---
  if (files && files.rightTopCardImage && files.rightTopCardImage[0]) {
    const rightUrl = await uploadBuffer(files.rightTopCardImage[0].buffer, 'editorial/right');
    updateData.rightTopCard = {
      ...(typeof updateData.rightTopCard === 'object' ? updateData.rightTopCard : {}),
      image: rightUrl,
    };
  } else if (payload.rightTopCard && payload.rightTopCard.image) {
    updateData.rightTopCard = {
      ...(typeof updateData.rightTopCard === 'object' ? updateData.rightTopCard : {}),
      image: payload.rightTopCard.image,
    };
  } else if (existing && existing.rightTopCard && existing.rightTopCard.image) {
    updateData.rightTopCard = {
      ...(typeof updateData.rightTopCard === 'object' ? updateData.rightTopCard : {}),
      image: existing.rightTopCard.image,
    };
  }

  // Trust highlights parse check
  if (typeof updateData.trustHighlights === 'string') {
    try {
      updateData.trustHighlights = JSON.parse(updateData.trustHighlights);
    } catch (e) {}
  }

  const showcase = await EditorialShowcase.findOneAndUpdate(
    {},
    { $set: updateData },
    { new: true, upsert: true, runValidators: true }
  );

  return showcase;
};

module.exports = {
  getEditorialShowcase,
  upsertEditorialShowcase,
};