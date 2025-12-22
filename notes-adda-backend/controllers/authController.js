const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { username, password, fullName } = req.body;
    try {
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        // HARDCODED ADMIN LOGIC AS REQUESTED
        let role = 'student';
        if (username === 'saurabh.doiphode') role = 'admin';

        const user = await User.create({ username, password: hashedPassword, fullName, role });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.status(201).json({ 
            token, 
            user: { id: user._id, name: user.fullName, role: user.role, username: user.username } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({ 
            token, 
            user: { id: user._id, name: user.fullName, role: user.role, username: user.username } 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
