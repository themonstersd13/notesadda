const express = require('express');
const router = express.Router();
const { getAllSubjects, addSubject, deleteSubject } = require('../controllers/subjectController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAllSubjects);
router.post('/', protect, admin, addSubject);
router.delete('/', protect, admin, deleteSubject); // Using body for delete params

module.exports = router;
