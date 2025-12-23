const express = require('express');
const router = express.Router();
const { uploadNote, getNotes, toggleLike, toggleDislike } = require('../controllers/noteController');
const { protect, optional } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/', protect, upload.single('file'), uploadNote);
router.get('/', optional, getNotes);

// Like / Unlike
router.post('/:id/like', protect, toggleLike);
// Dislike / Undislike
router.post('/:id/dislike', protect, toggleDislike);

module.exports = router;
