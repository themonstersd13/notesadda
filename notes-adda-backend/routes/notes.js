const express = require('express');
const router = express.Router();
const { uploadNote, getNotes, toggleLike, toggleDislike, deleteNote } = require('../controllers/noteController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public/Protected read/write
router.post('/', protect, upload.single('file'), uploadNote);
router.get('/', protect, getNotes); // Protect getNotes to allow identifying user for likes
router.get('/public', getNotes); // Optional: public version if needed

// Likes
router.post('/:id/like', protect, toggleLike);
router.post('/:id/dislike', protect, toggleDislike);

// Admin Delete
router.delete('/:id', protect, admin, deleteNote);

module.exports = router;