const mongoose = require('mongoose');

// CACHE THE CONNECTION
// This prevents Vercel from opening too many connections and crashing
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 1. If a connection already exists, use it.
  if (cached.conn) {
    console.log("✅ Using cached database connection");
    return cached.conn;
  }

  // 2. If no connection exists, create a new one.
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering to fail fast if no connection
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    };

    console.log("⏳ Connecting to MongoDB...");
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('✅ New MongoDB connection established');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", e);
    throw e; // Throw error so Vercel knows the request failed
  }

  return cached.conn;
};

module.exports = connectDB;