const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar, getPublicProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.post('/avatar', protect, upload.single('file'), uploadAvatar);

// Public Route (No protect middleware needed for viewing)
router.get('/u/:username', getPublicProfile);

module.exports = router;