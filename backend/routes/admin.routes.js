const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/admin/users
// @desc    Get all users (for admin dashboard)
// @access  Public (should add auth middleware in production)
router.get('/users', async (req, res) => {
  try {
    // Get all users, exclude password field
    const users = await User.find({})
      .select('-password -otp -otpExpires')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        college: user.college,
        year: user.year,
        verified: user.verified,
        trustScore: user.trustScore,
        createdAt: user.createdAt,
        phone: user.phone
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user by ID
// @access  Public (should add auth middleware in production)
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -otp -otpExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user by ID
// @access  Public (should add auth middleware in production)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users/email/:email
// @desc    Search user by email
// @access  Public (should add auth middleware in production)
router.get('/users/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() })
      .select('-password -otp -otpExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching user',
      error: error.message
    });
  }
});

module.exports = router;
