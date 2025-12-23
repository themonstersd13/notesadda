const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    message: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);
