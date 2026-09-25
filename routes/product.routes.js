  // routes/product.routes.js
  const express = require('express');
  const {
    getProducts,
    getProductDetails,
    addProduct,
    editProduct,
    removeProduct,
  } = require('../controllers/product.controller');
  const upload = require('../middlewares/upload.middleware');
  const { protect, authorize } = require('../middlewares/auth.middleware');

  const router = express.Router();


  router.get('/', getProducts);
  router.get('/:identifier', getProductDetails);
    


  // Admin routes 

  router.post('/', protect, authorize('admin'), upload.array('images', 5), addProduct);
  router.put('/:id', protect, authorize('admin'), upload.array('images', 5), editProduct);
  router.delete('/:id', protect, authorize('admin'), removeProduct);

  module.exports = router;