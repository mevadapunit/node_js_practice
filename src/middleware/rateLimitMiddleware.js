const rateLimit = require('express-rate-limit');

const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, 
    message: 'Too many requests from this IP, please try again later.',
    statusCode: 429,
});

module.exports = globalRateLimiter;
