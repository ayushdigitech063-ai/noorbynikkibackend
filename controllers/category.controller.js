const categoryService = require('../services/category.services');
const { uploadToCloudinary } = require('../config/cloudinary');

exports.getActiveCategories = async (req, res) => {
  try {
    const categories = await categoryService.getActiveCategories();
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, order, isActive } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Category image is required' });
    }

    await categoryService.checkDuplicateName(name);

   
    const imageUrl = await uploadToCloudinary(req.file.buffer, 'noorbynikki/categories');

    const newCategory = await categoryService.createCategory({
      name: name.trim(),
      imageUrl,
      order: order !== undefined ? Number(order) : 0,
      isActive: isActive !== undefined ? (isActive === 'true' || isActive === true) : true,
    });

    return res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    
    if (req.body.name && req.body.name.trim()) {
      const trimmedName = req.body.name.trim();
   
      await categoryService.checkDuplicateName(trimmedName, id);
      updateData.name = trimmedName;
    }

    if (req.body.order !== undefined) {
      updateData.order = Number(req.body.order);
    }

    if (req.body.isActive !== undefined) {
      updateData.isActive = req.body.isActive === 'true' || req.body.isActive === true;
    }

  
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.buffer, 'noorbynikki/categories');
      updateData.imageUrl = imageUrl;
    }

  
    const updated = await categoryService.updateCategory(id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeCategory = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    return res.status(error.statusCode || 400).json({ success: false, message: error.message });
  }
};