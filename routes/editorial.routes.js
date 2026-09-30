const express = require('express');
const router = express.Router();
const multer = require('multer');

// File Type Validation (JPEG, PNG, WEBP)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WEBP image formats are allowed!'), false);
  }
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter,
});

const { getShowcase, updateShowcase } = require('../controllers/editorial.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// Public route
router.get('/', getShowcase);

// Admin-protected update route with Multer error catching
router.put(
  '/',
  protect,
  authorize('admin'),
  (req, res, next) => {
    upload.fields([
      { name: 'leftCardImage', maxCount: 1 },
      { name: 'rightTopCardImage', maxCount: 1 },
    ])(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'Image size cannot exceed 5MB',
          });
        }
        return res.status(400).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  },
  updateShowcase
);

module.exports = router;