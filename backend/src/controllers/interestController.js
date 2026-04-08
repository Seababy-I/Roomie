const Interest = require('../models/Interest');
const Listing = require('../models/Listing');

// @desc    Express interest in a listing
// @route   POST /api/interests/:listingId
// @access  Private
const createInterest = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        // Cannot express interest in your own listing
        if (listing.userId.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot express interest in your own listing' });
        }

        const existingInterest = await Interest.findOne({
            listingId: req.params.listingId,
            userId: req.user._id
        });

        if (existingInterest) {
            return res.status(400).json({ message: 'Interest already expressed' });
        }

        const interest = await Interest.create({
            listingId: req.params.listingId,
            userId: req.user._id
        });

        // Also add to the listing's interestedUsers array
        listing.interestedUsers.push(req.user._id);
        await listing.save();

        res.status(201).json(interest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all interests for a specific listing (Owner only)
// @route   GET /api/interests/:listingId
// @access  Private
const getInterestsForListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.listingId);
        if (!listing) return res.status(404).json({ message: 'Listing not found' });

        // Check if user is owner
        if (listing.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Only the owner can view interested users' });
        }

        const interests = await Interest.find({ listingId: req.params.listingId })
            .populate('userId', 'name email phone createdAt');

        // Strip applicant's phone if interest is not accepted
        const safeInterests = interests.map(interest => {
            const i = interest.toObject();
            if (i.status !== 'accepted' && i.userId) {
                delete i.userId.phone;
            }
            return i;
        });

        res.json(safeInterests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update interest status (Accept/Reject)
// @route   PATCH /api/interests/:id
// @access  Private
const updateInterestStatus = async (req, res) => {
    const { status } = req.body; // 'accepted' or 'rejected'

    try {
        const interest = await Interest.findById(req.params.id).populate('listingId');
        if (!interest) return res.status(404).json({ message: 'Interest record not found' });

        // Check if current user is the listing owner
        if (interest.listingId.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        interest.status = status;
        await interest.save();

        res.json(interest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user's expressed interests
// @route   GET /api/interests/mine
// @access  Private
const getMyInterests = async (req, res) => {
    try {
        const interests = await Interest.find({ userId: req.user._id })
            .populate({
                path: 'listingId',
                select: 'title rent location images flatType',
                populate: {
                    path: 'userId',
                    select: 'name email phone'
                }
            });

        // Strip listing owner's phone if interest is not accepted
        const safeInterests = interests.map(interest => {
            const i = interest.toObject();
            if (i.status !== 'accepted' && i.listingId && i.listingId.userId) {
                delete i.listingId.userId.phone;
            }
            return i;
        });

        res.json(safeInterests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createInterest, getInterestsForListing, updateInterestStatus, getMyInterests };
