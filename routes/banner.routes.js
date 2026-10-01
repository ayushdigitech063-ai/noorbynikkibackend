const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const { protect, authorize } = require('../middlewares/auth.middleware');
const bannerController = require('../controllers/banner.controller');


router.get('/', bannerController.getActiveBanners);     // this  route in this route  page is only available  for the user 


router.get('/all', protect, authorize('admin'), bannerController.getAllBanners);
router.post('/', protect, authorize('admin'), upload.single('image'), bannerController.createBanner);
router.put('/:id', protect, authorize('admin'), upload.single('image'), bannerController.editBanner);
router.delete('/:id', protect, authorize('admin'), bannerController.deleteBanner);

module.exports = router;