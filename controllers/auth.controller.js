const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addAddress,
  getAllAddresses,
  updateAddress,
  deleteAddress,
  changeUserPassword
} = require('../services/auth.services');

exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const result = await registerUser({ name, email, password, confirmPassword });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const result = await loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await getUserProfile(req.user.id);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateUserProfile(req.user.id, req.body);
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.getAddresses = async (req, res) => {
  try {
    const addresses = await getAllAddresses(req.user.id);
    return res.status(200).json({
      success: true,
      count: addresses.length,
      data: addresses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const { street, city, state, postalCode, phone } = req.body;
    if (!street || !city || !state || !postalCode || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Street, city, state, postal code, and phone are required',
      });
    }

    const addresses = await addAddress(req.user.id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Address added successfully',
      data: addresses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const addresses = await updateAddress(req.user.id, req.params.addressId, req.body);
    return res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      data: addresses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const addresses = await deleteAddress(req.user.id, req.params.addressId);
    return res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: addresses,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirm new password are required',
      });
    }

    const result = await changeUserPassword(req.user.id, {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Internal server error',
    });
  }
};