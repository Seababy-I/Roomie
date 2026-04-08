const express = require('express');
const router = express.Router();
const { googleLogin, getUserProfile, updateUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// @route   POST /api/auth/google
router.post('/google', authLimiter, googleLogin);

// @route   GET /api/auth/me
router.get('/me', protect, getUserProfile);

// @route   PUT /api/auth/me
router.put('/me', protect, updateUserProfile);

module.exports = router;
