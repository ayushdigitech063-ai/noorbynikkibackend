const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const promotionController = require('../controllers/promotion.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');


router.get('/', promotionController.getActivePromotion);   //   this is only belongs to the  user aceess only 


router.get('/all', protect, authorize('admin'), promotionController.getAllPromotions);
router.post('/', protect, authorize('admin'), upload.single('image'), promotionController.createPromotion);
router.put('/:id', protect, authorize('admin'), upload.single('image'), promotionController.updatePromotion);
router.delete('/:id', protect, authorize('admin'), promotionController.deletePromotion);

module.exports = router;