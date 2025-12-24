const mongoose = require('mongoose');

// CACHE THE CONNECTION
// This prevents Vercel from opening too many connections and crashing
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // CRITICAL CHECK: Ensure the environment variable is actually loaded
  if (!process.env.MONGO_URI) {
    const err = new Error('❌ MONGO_URI is missing in Vercel Environment Variables.');
    console.error(err);
    throw err;
  }

  // 1. If a connection exists AND is fully connected (readyState === 1), use it.
  if (cached.conn && mongoose.connection.readyState === 1) {
    // console.log("✅ Using cached database connection");
    return cached.conn;
  }

  // 2. If disconnected or connecting, reset promise to force a fresh attempt
  if (mongoose.connection.readyState === 0 || mongoose.connection.readyState === 99) {
      cached.promise = null;
      console.log("⚠️ Stale connection detected. Reconnecting...");
  }

  // 3. Create new connection
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Fail fast if not connected
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    };

    console.log("⏳ Connecting to MongoDB...");
    
    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongoose) => {
      console.log('✅ New MongoDB connection established');
      return mongoose;
    }).catch(err => {
        // Don't keep a failed promise cached
        cached.promise = null;
        throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("❌ Failed to connect to MongoDB:", e.message);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;