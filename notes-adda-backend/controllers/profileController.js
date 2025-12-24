const Profile = require('../models/Profile');
const User = require('../models/User');
const Note = require('../models/Note');

// Get current user profile (Private)
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        let profile = await Profile.findOne({ user: userId });

        if (!profile) profile = await Profile.create({ user: userId });

        const notes = await Note.find({ uploadedBy: userId });
        const totalContributions = notes.length;
        const totalLikes = notes.reduce((sum, note) => sum + (note.likes || 0), 0);

        res.json({ user, profile, stats: { contributions: totalContributions, reactions: totalLikes, uploads: notes } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Public Profile by Username
exports.getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password');
        
        if (!user) return res.status(404).json({ message: "User not found" });

        const profile = await Profile.findOne({ user: user._id });
        
        // If no profile created yet, return basic info
        const profileData = profile || { bio: '', currentYear: '', linkedin: '', profilePhoto: '' };

        const notes = await Note.find({ uploadedBy: user._id });
        const totalContributions = notes.length;
        const totalLikes = notes.reduce((sum, note) => sum + (note.likes || 0), 0);

        res.json({
            user,
            profile: profileData,
            stats: {
                contributions: totalContributions,
                reactions: totalLikes,
                uploads: notes
            },
            isPublic: true // Flag to hide edit buttons on frontend
        });
    } catch (err) {
        console.error(err);
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
        res.status(500).json({ message: "Update failed" });
    }
};

// Upload Profile Photo
exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No image uploaded" });
        const userId = req.user.id;
        const profile = await Profile.findOneAndUpdate(
            { user: userId },
            { $set: { profilePhoto: req.file.path } }, 
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        res.json({ profilePhoto: profile.profilePhoto });
    } catch (err) {
        res.status(500).json({ message: "Image upload failed" });
    }
};