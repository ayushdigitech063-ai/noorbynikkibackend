// controllers/product.controller.js

const { uploadToCloudinary } = require('../config/cloudinary');
const {
  getAllProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/product.services');


exports.getProducts = async (req, res) => {
  try {
    const { products, meta } = await getAllProducts(req.query);
    return res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      data: products,
      meta,
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
    const product = await getProductByIdOrSlug(req.params.identifier);
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

exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required',
      });
    }

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'noorbynikki/products')
      );
      imageUrls = await Promise.all(uploadPromises);
    } else if (req.body.images) {
      imageUrls = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one product image',
      });
    }

    const productData = {
      ...req.body,
      images: imageUrls,
    };

    const product = await createProduct(productData);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };


    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'noorbynikki/products')
      );
      const newImageUrls = await Promise.all(uploadPromises);

      
      updateData.images = newImageUrls;
    }

    const updated = await updateProduct(req.params.id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
}


exports.removeProduct = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};