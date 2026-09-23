const express = require("express");
const {
  signup,
  login,
  getMe,
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  changePassword,
} = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.put("/change-password", protect, changePassword);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

router.get("/address", protect, getAddresses);
router.post("/address", protect, addAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);

module.exports = router;
