const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: { type: String, default: '' },
    currentYear: { type: String, enum: ['First Year', 'Second Year', 'Third Year', 'Final Year'], default: 'First Year' },
    branch: { type: String }, // Optional overlap with notes, useful for context
    linkedin: { type: String, default: '' },
    contactEmail: { type: String, default: '' }, // Distinct from auth email (if any)
    profilePhoto: { type: String, default: '' } // Cloudinary URL
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
