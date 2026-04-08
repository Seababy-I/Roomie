const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    const { tokenId } = req.body;

    try {
        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check or create user
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                profileImage: picture
            });
        }

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            profileImage: user.profileImage,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            profileImage: user.profileImage
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.phone = req.body.phone || user.phone;
        
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            profileImage: updatedUser.profileImage
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { googleLogin, getUserProfile, updateUserProfile };
