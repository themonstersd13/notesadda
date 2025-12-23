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

        // Resolve uploader's display name
        let authorName = undefined;
        try {
            const User = require('../models/User');
            const uploader = await User.findById(req.user.id);
            if (uploader) authorName = uploader.fullName || uploader.username;
        } catch (err) {
            // ignore
        }

        const newNote = await Note.create({
            title,
            branch,
            semester,
            subject,
            fileUrl: req.file.path,
            fileType: req.file.mimetype.includes('pdf') ? 'pdf' : 'img',
            uploadedBy: req.user.id,
            authorName
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

        const notes = await Note.find(query).sort({ createdAt: -1 }).populate('uploadedBy', 'fullName username');

        const normalize = (n) => {
            const obj = n.toObject();
            obj.likes = Array.isArray(obj.likesBy) ? obj.likesBy.length : (obj.likes || 0);
            obj.dislikes = Array.isArray(obj.dislikesBy) ? obj.dislikesBy.length : 0;
            if (!obj.authorName && obj.uploadedBy) {
                obj.authorName = obj.uploadedBy.fullName || obj.uploadedBy.username;
            }
            return obj;
        };

        if (req.user && req.user.id) {
            const userId = req.user.id.toString();
            const annotated = notes.map(n => {
                const obj = normalize(n);
                obj.liked = Array.isArray(n.likesBy) && n.likesBy.map(id => id.toString()).includes(userId);
                obj.disliked = Array.isArray(n.dislikesBy) && n.dislikesBy.map(id => id.toString()).includes(userId);
                return obj;
            });
            return res.json(annotated);
        }

        const normalized = notes.map(n => {
            const obj = normalize(n);
            obj.liked = false;
            obj.disliked = false;
            return obj;
        });

        res.json(normalized);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Toggle like
exports.toggleLike = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const alreadyLiked = note.likesBy && note.likesBy.includes(userId);
        const alreadyDisliked = note.dislikesBy && note.dislikesBy.includes(userId);

        if (alreadyLiked) {
            note.likesBy.pull(userId);
        } else {
            note.likesBy.push(userId);
            if (alreadyDisliked) note.dislikesBy.pull(userId);
        }

        note.likes = note.likesBy.length;
        await note.save();

        res.json({ 
            id: note._id, 
            likes: note.likes, 
            dislikes: note.dislikesBy.length, 
            liked: !alreadyLiked 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Toggle dislike
exports.toggleDislike = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const alreadyDisliked = note.dislikesBy && note.dislikesBy.includes(userId);
        const alreadyLiked = note.likesBy && note.likesBy.includes(userId);

        if (alreadyDisliked) {
            note.dislikesBy.pull(userId);
        } else {
            note.dislikesBy.push(userId);
            if (alreadyLiked) note.likesBy.pull(userId);
        }

        note.likes = note.likesBy.length; // Ensure sync
        await note.save();

        res.json({ 
            id: note._id, 
            likes: note.likes, 
            dislikes: note.dislikesBy.length, 
            disliked: !alreadyDisliked 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Note (Admin Only)
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        await Note.findByIdAndDelete(req.params.id);
        res.json({ message: "Note deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};