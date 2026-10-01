const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  getCart,
  addItemToCart,
  updateQuantity,
  removeItem,
  clearUserCart,
} = require('../controllers/cart.controller');

router.use(protect);

router.get('/', getCart);
router.post('/add', addItemToCart);
router.put('/item/:itemId', updateQuantity);
router.delete('/item/:itemId', removeItem);
router.delete('/clear', clearUserCart);

module.exports = router;