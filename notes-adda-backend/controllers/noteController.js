const Note = require('../models/Note');
const Subject = require('../models/Subject');

exports.uploadNote = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        
        const { title, branch, semester, subject, isNewSubject } = req.body;
        
        // Handle Dynamic Subject Creation
        if (isNewSubject === 'true') {
            const exists = await Subject.findOne({ branch, semester, name: subject });
            if (!exists) {
                await Subject.create({ branch, semester, name: subject });
            }
        }

        const newNote = await Note.create({
            title,
            branch,
            semester,
            subject,
            fileUrl: req.file.path,
            fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'img',
            uploadedBy: req.user.id,
            authorName: req.user.username // Or fetch fullName
        });

        res.status(201).json(newNote);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getNotes = async (req, res) => {
    try {
        const { branch, semester, subject, search } = req.query;
        let query = {};

        if (branch) query.branch = branch;
        if (semester) query.semester = semester;
        if (subject) query.subject = subject;
        
        if (search) {
            query.$text = { $search: search };
        }

        const notes = await Note.find(query).sort({ createdAt: -1 });
        res.json(notes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
