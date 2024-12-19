const express = require("express");
const router = new express.Router();

const { authControllers } = require("../Controllers");
const { loginSignupRateLimiter } = require("../Utilities");

/*
************************** APIs **************************

1. Login API - "{BACKEND_URL}/api/v1/auth/login"
2. Register API - "{BACKEND_URL}/api/v1/auth/register"

**********************************************************
*/


// Login API
router.post("/login", loginSignupRateLimiter, authControllers.loginUser);

// Register API
router.post("/register", loginSignupRateLimiter, authControllers.register);

module.exports = router;