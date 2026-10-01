const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} = require('../controllers/wishList.controller');


router.use(protect);

router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;