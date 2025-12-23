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

        // Resolve uploader's display name (token may not include username/fullName)
        let authorName = undefined;
        try {
            const User = require('../models/User');
            const uploader = await User.findById(req.user.id);
            if (uploader) authorName = uploader.fullName || uploader.username;
        } catch (err) {
            // ignore - fallback to undefined
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

        // Populate uploader info so older notes without authorName can still show a name
        const notes = await Note.find(query).sort({ createdAt: -1 }).populate('uploadedBy', 'fullName username');

        // Helper to normalize a single note
        const normalize = (n) => {
            const obj = n.toObject();
            obj.likes = Array.isArray(obj.likesBy) ? obj.likesBy.length : (obj.likes || 0);
            obj.dislikes = Array.isArray(obj.dislikesBy) ? obj.dislikesBy.length : 0;
            // prefer explicit authorName, otherwise use uploader info
            if (!obj.authorName && obj.uploadedBy) {
                obj.authorName = obj.uploadedBy.fullName || obj.uploadedBy.username;
            }
            return obj;
        };

        // If user is authenticated, annotate whether they liked/disliked each note
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

        // For unauthenticated requests, return normalized notes with liked=false/disliked=false
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

// Toggle like / unlike for a note
exports.toggleLike = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user && req.user.id;
        console.log(`toggleLike called: user=${userId}, note=${noteId}`);

        if (!userId) {
            console.warn('toggleLike: missing user id in token');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const alreadyLiked = note.likesBy && note.likesBy.map(id => id.toString()).includes(userId.toString());
        const alreadyDisliked = note.dislikesBy && note.dislikesBy.map(id => id.toString()).includes(userId.toString());

        if (alreadyLiked) {
            // remove like
            note.likesBy = note.likesBy.filter(id => id.toString() !== userId.toString());
        } else {
            // add like
            note.likesBy = note.likesBy || [];
            note.likesBy.push(userId);
            // if previously disliked, remove dislike
            if (alreadyDisliked) {
                note.dislikesBy = note.dislikesBy.filter(id => id.toString() !== userId.toString());
            }
        }

        // keep numeric fields in sync
        note.likes = note.likesBy ? note.likesBy.length : 0;
        const dislikesCount = note.dislikesBy ? note.dislikesBy.length : 0;

        await note.save();

        console.log(`toggleLike result: note=${noteId} likes=${note.likes} liked=${!alreadyLiked} dislikes=${dislikesCount}`);
        res.json({ id: note._id, likes: note.likes, dislikes: dislikesCount, liked: !alreadyLiked });
    } catch (err) {
        console.error('toggleLike error', err);
        res.status(500).json({ message: err.message });
    }
};

// Toggle dislike / undislike for a note
exports.toggleDislike = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user && req.user.id;
        console.log(`toggleDislike called: user=${userId}, note=${noteId}`);

        if (!userId) {
            console.warn('toggleDislike: missing user id in token');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const note = await Note.findById(noteId);
        if (!note) return res.status(404).json({ message: 'Note not found' });

        const alreadyDisliked = note.dislikesBy && note.dislikesBy.map(id => id.toString()).includes(userId.toString());
        const alreadyLiked = note.likesBy && note.likesBy.map(id => id.toString()).includes(userId.toString());

        if (alreadyDisliked) {
            // remove dislike
            note.dislikesBy = note.dislikesBy.filter(id => id.toString() !== userId.toString());
        } else {
            // add dislike
            note.dislikesBy = note.dislikesBy || [];
            note.dislikesBy.push(userId);
            // if previously liked, remove like
            if (alreadyLiked) {
                note.likesBy = note.likesBy.filter(id => id.toString() !== userId.toString());
            }
        }

        // keep numeric fields in sync
        const likesCount = note.likesBy ? note.likesBy.length : 0;
        note.likes = likesCount;
        const dislikesCount = note.dislikesBy ? note.dislikesBy.length : 0;

        await note.save();

        console.log(`toggleDislike result: note=${noteId} dislikes=${dislikesCount} disliked=${!alreadyDisliked} likes=${likesCount}`);
        res.json({ id: note._id, likes: likesCount, dislikes: dislikesCount, disliked: !alreadyDisliked });
    } catch (err) {
        console.error('toggleDislike error', err);
        res.status(500).json({ message: err.message });
    }
};
