const Feedback = require('../models/Feedback');

exports.createFeedback = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!message || !message.trim()) return res.status(400).json({ message: 'Message is required' });
        // no minimum length required for feedback messages

        const fb = await Feedback.create({ name, email, message });
        console.log('Feedback received:', { id: fb._id, name: fb.name, email: fb.email });
        res.status(201).json({ message: 'Feedback submitted', feedback: fb });
    } catch (err) {
        console.error('createFeedback error', err);
        res.status(500).json({ message: err.message });
    }
};