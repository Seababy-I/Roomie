const rateLimit = require('express-rate-limit');

// Rate limit for auth endpoints to prevent brute force
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 OTP requests per window
    message: { message: 'Too many OTP attempts, please try again after 15 minutes' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

// General rate limit for API endpoints
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 60, // Limit each IP to 60 requests per minute
    message: { message: 'Too many requests, please slow down' },
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

module.exports = { authLimiter, apiLimiter };
