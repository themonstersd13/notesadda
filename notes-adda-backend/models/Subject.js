const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    branch: { type: String, required: true },
    semester: { type: String, required: true },
    name: { type: String, required: true }
});

// Ensure a subject name is unique within a specific branch and semester
// (e.g., You can have "Math" in Sem 1 and Sem 2, but not twice in Sem 1)
SubjectSchema.index({ branch: 1, semester: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Subject', SubjectSchema);