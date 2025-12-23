const Profile = require('../models/Profile');
const User = require('../models/User');
const Note = require('../models/Note');

// Get current user profile + stats
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        let profile = await Profile.findOne({ user: userId });

        if (!profile) {
            profile = await Profile.create({ user: userId });
        }

        const notes = await Note.find({ uploadedBy: userId });
        const totalContributions = notes.length;
        const totalLikes = notes.reduce((sum, note) => sum + (note.likes || 0), 0);

        res.json({
            user,
            profile,
            stats: {
                contributions: totalContributions,
                reactions: totalLikes,
                uploads: notes
            }
        });
    } catch (err) {
        console.error("Get Profile Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update profile details
exports.updateProfile = async (req, res) => {
    try {
        const { bio, currentYear, linkedin, contactEmail } = req.body;
        const userId = req.user.id;

        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { bio, currentYear, linkedin, contactEmail },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(profile);
    } catch (err) {
        console.error("Update Profile Error:", err);
        res.status(500).json({ message: "Update failed" });
    }
};

// Upload Profile Photo
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            console.error("Upload Avatar: No file received");
            return res.status(400).json({ message: "No image uploaded" });
        }

        const userId = req.user.id;
        
        // Use $set to ensure atomic update
        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: { profilePhoto: req.file.path } }, 
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json({ profilePhoto: profile.profilePhoto });
    } catch (err) {
        console.error("Avatar Upload Error:", err); // CHECK YOUR TERMINAL FOR THIS LOG
        res.status(500).json({ message: "Image upload failed: " + err.message });
    }
};