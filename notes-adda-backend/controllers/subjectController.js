const Subject = require('../models/Subject');

// Get Subjects structured by branch -> semester
exports.getAllSubjects = async (req, res) => {
    try {
        const subjects = await Subject.find({});
        
        // Transform into { cse: { 'Semester 1': ['Sub1', 'Sub2'] } } format for Frontend
        const structuredData = {};
        
        subjects.forEach(sub => {
            if (!structuredData[sub.branch]) structuredData[sub.branch] = {};
            if (!structuredData[sub.branch][sub.semester]) structuredData[sub.branch][sub.semester] = [];
            structuredData[sub.branch][sub.semester].push(sub.name);
        });

        res.json(structuredData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addSubject = async (req, res) => {
    try {
        const { branch, semester, name } = req.body;
        const newSubject = await Subject.create({ branch, semester, name });
        res.status(201).json(newSubject);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        // Find by name, sem, branch OR id
        // For simplicity using name matching based on frontend logic
        const { branch, semester, name } = req.body;
        await Subject.deleteOne({ branch, semester, name });
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
