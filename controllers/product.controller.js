const productService = require('../services/product.services');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

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

exports.createProduct = async (req, res) => {
  let uploadedImages = [];
  try {
    const productData = { ...req.body };

    if (typeof productData.sizes === 'string') {
      try {
        productData.sizes = JSON.parse(productData.sizes);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid JSON format in sizes' });
      }
    }

    if (typeof productData.tags === 'string') {
      try {
        productData.tags = JSON.parse(productData.tags);
      } catch {
        productData.tags = productData.tags.split(',').map((t) => t.trim());
      }
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one product image is required' });
    }

    const uploadPromises = req.files.map((file) =>
      uploadToCloudinary(file.buffer, 'noorbynikki/products')
    );
    uploadedImages = await Promise.all(uploadPromises);
    productData.images = uploadedImages;

    const newProduct = await productService.createProduct(productData);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    if (uploadedImages.length > 0) {
      await Promise.allSettled(uploadedImages.map((imgUrl) => deleteFromCloudinary(imgUrl)));
    }
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to create product',
    });
  }
};

exports.editProduct = async (req, res) => {
  let uploadedNewImages = [];
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

    if (typeof updateData.deletedImages === 'string') {
      try {
        updateData.deletedImages = JSON.parse(updateData.deletedImages);
      } catch {
        updateData.deletedImages = [updateData.deletedImages];
      }
    }

    delete updateData.images;

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'noorbynikki/products')
      );
      uploadedNewImages = await Promise.all(uploadPromises);
    }

    const updated = await productService.updateProduct(req.params.id, updateData, uploadedNewImages);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    if (uploadedNewImages.length > 0) {
      await Promise.allSettled(uploadedNewImages.map((imgUrl) => deleteFromCloudinary(imgUrl)));
    }
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Failed to update product',
    });
  }
};

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