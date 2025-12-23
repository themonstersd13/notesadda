const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error('❌ MongoDB Connection Error: MONGO_URI is not set in .env');
            // Do not exit process; allow server to start for local UI testing
            return;
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        // Do not abruptly exit here to make debugging easier during development
    }
};

module.exports = connectDB;
