const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per image
});

const productController = require('../controllers/product.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public Listing & Single Product Details
router.get('/', productController.getProducts);
router.get('/:identifier', productController.getProductDetails);

// Admin Protected Actions
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.array('images', 5), // Up to 5 product images
  productController.createProduct
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.array('images', 5),
  productController.editProduct
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  productController.removeProduct
);

module.exports = router;