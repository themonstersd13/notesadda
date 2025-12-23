const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    title: { type: String, required: true },
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    subject: { type: String, required: true },
    fileUrl: { type: String, required: true }, // Cloudinary URL
    fileType: { type: String, enum: ['pdf', 'img'], default: 'pdf' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String }, // Display name snapshot
    
    // Counters for quick display
    likes: { type: Number, default: 0 },
    
    // Arrays to track WHO liked/disliked (Prevent duplicates)
    likesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikesBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Create text index for search functionality
NoteSchema.index({ title: 'text', subject: 'text' });

module.exports = mongoose.model('Note', NoteSchema);