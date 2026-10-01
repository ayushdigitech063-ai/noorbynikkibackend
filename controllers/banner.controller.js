const bannerService = require('../services/banner.services');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');


exports.getActiveBanners = async (req, res) => {
  try {
    const { position } = req.query;
    const banners = await bannerService.getActiveBanners(position);

    return res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};


exports.getAllBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners(req.query);

    return res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};


exports.createBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Banner image is required',
      });
    }


    const imageUrl = await uploadToCloudinary(req.file.buffer, 'noorbynikki/banners');

    const bannerData = {
      ...req.body,
      imageUrl,
    };


    if (bannerData.order) bannerData.order = Number(bannerData.order);
    if (bannerData.isActive !== undefined) {
      bannerData.isActive = bannerData.isActive === 'true' || bannerData.isActive === true;
    }

    const newBanner = await bannerService.createBanner(bannerData);

    return res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: newBanner,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create banner',
    });
  }
};


exports.editBanner = async (req, res) => {
  try {
    const updateData = { ...req.body };

  
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'noorbynikki/banners');
      updateData.imageUrl = imageUrl;
    }

    if (updateData.order) updateData.order = Number(updateData.order);
    if (updateData.isActive !== undefined) {
      updateData.isActive = updateData.isActive === 'true' || updateData.isActive === true;
    }

    const updated = await bannerService.updateBanner(req.params.id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update banner',
    });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const deletedBanner = await bannerService.deleteBanner(req.params.id);

    
    if (deletedBanner.imageUrl) {
      await deleteFromCloudinary(deletedBanner.imageUrl);
    }

    return res.status(200).json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to delete banner',
    });
  }
};