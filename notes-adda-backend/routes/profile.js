const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadAvatar } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);
router.post('/avatar', protect, upload.single('file'), uploadAvatar);

module.exports = router;