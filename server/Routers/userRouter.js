const express = require("express");
const multer = require("multer");
const path = require("path");

const router = new express.Router();

const { userControllers } = require("../Controllers");

/*
************************** APIs **************************

1. Edit Profile API - "{BACKEND_URL}/api/v1/user/edit-profile"

**********************************************************
*/

// Multer configuration for handling profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/ProfilePicUploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Middleware to handle profile picture upload
const uploadProfilePicture = upload.single("profilePicture");

// Edit Profile API
router.post("/edit-profile", uploadProfilePicture, userControllers.editProfile);

module.exports = router;
