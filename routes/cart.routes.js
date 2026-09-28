const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

// User protected routes
router.use(protect);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.put('/update-quantity', cartController.updateQuantity);
router.delete('/item/:itemId', cartController.removeItem);
router.delete('/clear', cartController.clearCart);

module.exports = router;