const productService = require('../services/product.services');
const { uploadToCloudinary } = require('../config/cloudinary');

// 1. Master List & Filter Endpoint
exports.getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);
    return res.status(200).json({
      success: true,
      total: result.total,
      page: result.page,
      pages: result.pages,
      data: result.data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// 2. Single Product Details (Supports ID or Slug)
exports.getProductDetails = async (req, res) => {
  try {
    const product = await productService.getProductByIdOrSlug(req.params.identifier);
    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

// 3. Create Product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };

    // Parse sizes array if sent as multipart form-data JSON string
    if (typeof productData.sizes === 'string') {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid JSON format in sizes' });
      }
    }

    // Parse tags array if string
    if (typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch {
        productData.tags = productData.tags.split(',').map((t) => t.trim());
      }
    }

    // Upload images to Cloudinary
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product image is required' });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, 'noorbynikki/products')
    );
    productData.images = await Promise.all(uploadPromises);

    const newProduct = await productService.createProduct(productData);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

// 4. Update Product (Admin)
exports.editProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (typeof updateData.sizes === 'string') {
      try {
        updateData.sizes = JSON.parse(updateData.sizes);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid JSON format in sizes' });
      }
    }

    if (typeof updateData.tags === 'string') {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch {
        updateData.tags = updateData.tags.split(',').map((t) => t.trim());
      }
    }

    // Upload any new images
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'noorbynikki/products')
      );
      newImages = await Promise.all(uploadPromises);
    }

    const updated = await productService.updateProduct(req.params.id, updateData, newImages);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

// 5. Delete Product (Admin)
exports.removeProduct = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to delete product',
    });
  }
};