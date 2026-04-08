const mongoose = require('mongoose');
require('dotenv').config(); // Should load .env in current directory

const testConnection = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.error('❌ MONGO_URI is missing from .env');
            process.exit(1);
        }
        console.log('URI found, connecting...');
        
        await mongoose.connect(uri);
        console.log('✅ Connection Successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
        process.exit(1);
    }
};

testConnection();
