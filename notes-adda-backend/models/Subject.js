const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    name: { type: String, required: true }
});

// Ensure no duplicates per semester
SubjectSchema.index({ branch: 1, semester: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', SubjectSchema);
