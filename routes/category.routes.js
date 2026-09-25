const express = require('express');
const router = express.Router();
const multer = require('multer');


const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
});

const {
  getActiveCategories,
  getAllCategories,
  createCategory,
  editCategory,
  removeCategory,
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');


router.get('/',getActiveCategories);


router.get(
  '/all',
  protect,
  authorize('admin'),
 getAllCategories
);


router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
 createCategory
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('image'),
editCategory
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
removeCategory
);

module.exports = router;