const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'Dev@v1@123!';

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = auth;


