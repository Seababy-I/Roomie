const mongoose = require('mongoose');
const Listing = require('./src/models/Listing');
const User = require('./src/models/User');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for seeding...');

        const sampleUser = await User.findOne({ email: 'test@learner.manipal.edu' });

        if (sampleUser) {
            await Listing.deleteMany({ userId: sampleUser._id });
            await User.deleteOne({ _id: sampleUser._id });
            console.log('✅ Removed sample listings and test user.');
        } else {
            console.log('No sample seed data found.');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seedData();
