const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        console.warn('protect: no authorization token provided');
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // For debugging, log user id
        console.log('protect: token verified for user', decoded.id);
        next();
    } catch (err) {
        console.error('protect: token verification failed', err.message);
        res.status(401).json({ message: "Token is not valid" });
    }
};

// Optional - try to decode token and attach user if present, but don't fail when missing/invalid
exports.optional = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return next();

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        // ignore invalid token - proceed as unauthenticated
    }
    next();
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Admin privileges required" });
    }
};
