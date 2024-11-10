const jwt = require('jsonwebtoken');

const generateToken = (user, secret, expiresIn) => {
    return jwt.sign(
        { id: user.id, role: user.role, email: user.email },
        secret,
        { expiresIn }
    );
};

module.exports = {
    generateToken
};
