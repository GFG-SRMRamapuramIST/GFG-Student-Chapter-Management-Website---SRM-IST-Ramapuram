const express = require("express");
const router = new express.Router();

const { authControllers } = require("../Controllers");
const { loginSignupRateLimiter } = require("../Utilities");

// Login API
router.post("/login", loginSignupRateLimiter, authControllers.loginUser);

// Register API
router.post("/register", loginSignupRateLimiter, authControllers.register);

module.exports = router;