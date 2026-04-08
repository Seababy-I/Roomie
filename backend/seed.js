const mongoose = require('mongoose');
const Listing = require('./src/models/Listing');
const User = require('./src/models/User');
require('dotenv').config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected for seeding...');

        // Create a mock user
        let user = await User.findOne({ email: 'test@learner.manipal.edu' });
        if (!user) {
            user = await User.create({
                name: 'Test Student',
                email: 'test@learner.manipal.edu',
                phone: '9876543210'
            });
        }

        // Create mock listings
        const listings = [
            {
                userId: user._id,
                title: 'Stunning 2BHK near MIT Gateway',
                rent: 14000,
                location: 'Near Gate 1',
                flatType: '2BHK',
                genderPreference: 'Male',
                moveInDate: new Date(),
                amenities: ['WiFi', 'AC', 'Power Backup'],
                description: 'Looking for a chill roommate. The flat is fully furnished.',
                compatibilityTags: { cleanliness: 'High', sleepSchedule: 'Flexible', foodPreference: 'Any' }
            },
            {
                userId: user._id,
                title: 'Cozy Room in Tiger Circle',
                rent: 9000,
                location: 'Tiger Circle',
                flatType: 'PG',
                genderPreference: 'Female',
                moveInDate: new Date(),
                amenities: ['Mess', 'WiFi', 'Laundry'],
                description: 'Walking distance to MIT. All girls apartment.',
                compatibilityTags: { cleanliness: 'Medium', sleepSchedule: 'Early Bird', foodPreference: 'Veg' }
            }
        ];

        await Listing.deleteMany({});
        await Listing.insertMany(listings);

        console.log('✅ Seed successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
};

seedData();
