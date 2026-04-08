const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

// Ensure a user can only express interest once per listing
interestSchema.index({ listingId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
