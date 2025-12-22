const express = require('express');
const router = express.Router();
const { uploadNote, getNotes } = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.post('/', protect, upload.single('file'), uploadNote);
router.get('/', getNotes);

module.exports = router;
