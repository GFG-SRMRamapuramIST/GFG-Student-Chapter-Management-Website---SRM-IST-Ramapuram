const rateLimit = require("express-rate-limit");

// Define the rate limiter
const loginSignupRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 3, // Allow 3 failed requests per window
  handler: (req, res) => {
    const resetTime = new Date(req.rateLimit.resetTime).toLocaleTimeString();
    res.status(429).json({
      message: `Too many failed attempts! Please try again at ${resetTime}`,
    });
  },
  requestWasSuccessful: (req, res) => res.statusCode < 400,
  skipSuccessfulRequests: true,
});

module.exports = loginSignupRateLimiter;
