const express = require("express");
const router = new express.Router();

const { authControllers } = require("../Controllers");

// sample API
router.get("/", authControllers.api);

// Register
router.post("/register", authControllers.register);

module.exports = router;
