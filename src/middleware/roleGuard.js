const roleGuard = (...allowedRoles) => {
    return (req, res, next) => {
        // Ensure the user is authenticated
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: 'Unauthorized: No token provided.' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have permission to access this resource.' });
        }

        next(); 
    };
};

module.exports = roleGuard;
