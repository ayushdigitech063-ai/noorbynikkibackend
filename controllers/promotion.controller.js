const promotionService = require('../services/promotion.services');
const { uploadToCloudinary } = require('../config/cloudinary');


exports.getActivePromotion = async (req, res) => {
  try {
    const promotion = await promotionService.getActivePromotion();
    return res.status(200).json({
      success: true,
      data: promotion,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};


exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await promotionService.getAllPromotions();
    return res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};


exports.createPromotion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Promotion image is required',
      });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer, 'noorbynikki/promotions');

    const promoData = {
      ...req.body,
      imageUrl,
    };

    if (promoData.isActive !== undefined) {
      promoData.isActive = promoData.isActive === 'true' || promoData.isActive === true;
    }

    const newPromotion = await promotionService.createPromotion(promoData);

    return res.status(201).json({
      success: true,
      message: 'Promotion created successfully',
      data: newPromotion,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create promotion',
    });
  }
};


exports.updatePromotion = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'noorbynikki/promotions');
      updateData.imageUrl = imageUrl;
    }

    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }

    const updated = await promotionService.updatePromotion(req.params.id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Promotion updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update promotion',
    });
  }
};


exports.deletePromotion = async (req, res) => {
  try {
    const result = await promotionService.deletePromotion(req.params.id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to delete promotion',
    });
  }
};