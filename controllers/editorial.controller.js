const editorialService = require('../services/editorial.services');

const getShowcase = async (req, res) => {
  try {
    const showcase = await editorialService.getEditorialShowcase();

    return res.status(200).json({
      success: true,
      data: showcase || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve editorial showcase data',
      error: error.message,
    });
  }
};

const updateShowcase = async (req, res) => {
  try {
    const adminUserId = req.user ? req.user._id : null;
    const files = req.files;
    const body = req.body;

    const updatedData = await editorialService.upsertEditorialShowcase(
      body,
      files,
      adminUserId
    );

    return res.status(200).json({
      success: true,
      message: 'Editorial showcase saved successfully',
      data: updatedData,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to update editorial showcase',
    });
  }
};

module.exports = {
  getShowcase,
  updateShowcase,
};