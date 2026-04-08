const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    rent: {
        type: Number,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    flatType: {
        type: String,
        enum: ['1BHK', '2BHK', '3BHK', 'PG', 'Other'],
        required: true,
    },
    genderPreference: {
        type: String,
        enum: ['Male', 'Female', 'Any'],
        required: true,
    },
    moveInDate: {
        type: Date,
        required: true,
    },
    amenities: [{
        type: String,
    }],
    description: {
        type: String,
        required: true,
    },
    images: [{
        type: String, // URLs to images
    }],
    compatibilityTags: {
        cleanliness: { type: String, enum: ['Low', 'Medium', 'High'] },
        sleepSchedule: { type: String, enum: ['Early Bird', 'Night Owl', 'Flexible'] },
        foodPreference: { type: String, enum: ['Veg', 'Non-Veg', 'Any'] },
    },
    interestedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, {
    timestamps: true
});

// Index for search/filtering
listingSchema.index({ rent: 1, location: 'text', genderPreference: 1, flatType: 1 });

module.exports = mongoose.model('Listing', listingSchema);
