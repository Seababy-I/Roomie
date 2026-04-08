const Listing = require('../models/Listing');

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
const createListing = async (req, res) => {
    const { 
        title, rent, location, flatType, genderPreference, 
        moveInDate, amenities, description, images, compatibilityTags 
    } = req.body;

    // Check if user has a phone number in their profile
    const user = await require('../models/User').findById(req.user._id);
    if (!user.phone || user.phone.trim() === '') {
        return res.status(400).json({ message: 'Phone number is mandatory to post a listing. Please update it in your profile settings.' });
    }

    try {
        const listing = await Listing.create({
            userId: req.user._id,
            title, rent, location, flatType, genderPreference,
            moveInDate, amenities, description, images, compatibilityTags
        });

        if (listing) {
            res.status(201).json(listing);
        } else {
            res.status(400).json({ message: 'Invalid listing data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all listings (with pagination and filters)
// @route   GET /api/listings
// @access  Public
const getListings = async (req, res) => {
    try {
        const pageSize = Number(req.query.limit) || 12;
        const pageNum = Number(req.query.page) || 1;

        // Filters
        let query = {};
        if (req.query.minRent || req.query.maxRent) {
            query.rent = {};
            if (req.query.minRent) query.rent.$gte = Number(req.query.minRent);
            if (req.query.maxRent) query.rent.$lte = Number(req.query.maxRent);
        }
        if (req.query.location) {
            query.location = { $regex: req.query.location, $options: 'i' };
        }
        if (req.query.genderPreference && req.query.genderPreference !== 'Any') {
            query.genderPreference = req.query.genderPreference;
        }
        if (req.query.flatType) {
            query.flatType = req.query.flatType;
        }

        const count = await Listing.countDocuments(query);
        const listings = await Listing.find(query)
            .sort({ createdAt: -1 })
            .limit(pageSize)
            .skip(pageSize * (pageNum - 1))
            .populate('userId', 'name email');

        res.json({
            listings,
            page: pageNum,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id)
            .populate('userId', 'name email')
            .populate('interestedUsers', 'name email');

        if (listing) {
            res.json(listing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            // Check if user owns the listing
            if (listing.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'User not authorized to delete this listing' });
            }

            await listing.deleteOne();
            res.json({ message: 'Listing removed' });
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createListing,
    getListings,
    getListingById,
    deleteListing
};
