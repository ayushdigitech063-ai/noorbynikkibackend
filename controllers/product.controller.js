// controllers/product.controller.js

const { uploadToCloudinary } = require('../config/cloudinary');
const {
  getAllProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../services/product.services');
const Product = require("../models/product.model")

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

exports.addProduct = async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, description, price, and category are required',
      });
    }
    let parsedSizes = [];
    if (req.body.sizes) {
      if (typeof req.body.sizes === 'string') {
        try {
          parsedSizes = JSON.parse(req.body.sizes);
        } catch (e) {
          return res.status(400).json({
            success: false,
            message: 'Sizes must be a valid JSON array like [{"size":"M","stock":15}]',
          });
        }
      } else if (Array.isArray(req.body.sizes)) {
        parsedSizes = req.body.sizes;
      }
    }

    if (!parsedSizes || parsedSizes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one size with its stock',
      });
    }
    parsedSizes = parsedSizes.map((item) => ({
      size: item.size,
      stock: Number(item.stock) || 0,
    }));

    const totalCalculatedStock = parsedSizes.reduce(
      (sum, item) => sum + item.stock,
      0
    );

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
      sizes: parsedSizes,
      stock: totalCalculatedStock,
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

    // 1. SIZES HANDLING & PARSING
    if (updateData.sizes) {
      let parsedSizes = [];

      if (typeof updateData.sizes === 'string') {
        try {
          parsedSizes = JSON.parse(updateData.sizes);
        } catch (err1) {
          try {
            const sanitizedString = updateData.sizes.replace(/'/g, '"');
            parsedSizes = JSON.parse(sanitizedString);
          } catch (err2) {
            return res.status(400).json({
              success: false,
              message: 'Sizes must be a valid JSON array like [{"size":"M","stock":15}]',
            });
          }
        }
      } else if (Array.isArray(updateData.sizes)) {
        parsedSizes = updateData.sizes;
      }

      parsedSizes = parsedSizes.map((item) => ({
        size: item.size,
        stock: Number(item.stock) || 0,
      }));

      updateData.sizes = parsedSizes;

      updateData.stock = parsedSizes.reduce(
        (sum, item) => sum + item.stock,
        0
      );
    }

    if (req.files && req.files.length > 0) {

      const uploadPromises = req.files.map((file) =>
        uploadToCloudinary(file.buffer, 'noorbynikki/products')
      );
      const newImageUrls = await Promise.all(uploadPromises);

 
      const currentProduct = await Product.findById(req.params.id);
      const dbOldImages = currentProduct ? currentProduct.images : [];

      updateData.images = [...dbOldImages, ...newImageUrls];
    } else {
      
      if (req.body.existingImages) {
        try {
          const parsed = JSON.parse(req.body.existingImages);
          updateData.images = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          updateData.images = Array.isArray(req.body.existingImages)
            ? req.body.existingImages
            : [req.body.existingImages];
        }
      }
    }

  
    const updated = await updateProduct(req.params.id, updateData);

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('EditProduct Error:', error);
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

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