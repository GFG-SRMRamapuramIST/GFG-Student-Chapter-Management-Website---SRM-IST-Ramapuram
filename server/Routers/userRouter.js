const express = require("express");
const multer = require("multer");
const path = require("path");

const router = new express.Router();

const { userControllers } = require("../Controllers");

/*
************************** APIs **************************

1. Edit Profile API - "{BACKEND_URL}/api/v1/user/edit-profile"
2. Join a Team API - "{BACKEND_URL}/api/v1/user/join-team"
3. Leave a Team API - "{BACKEND_URL}/api/v1/user/leave-team"

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

//1. Edit Profile API
router.post("/edit-profile", uploadProfilePicture, userControllers.editProfile);

//2. Join a Team API
router.post("/join-team", userControllers.joinTeam);

//3. Leave a Team API
router.post("/leave-team", userControllers.leaveTeam);

module.exports = router;
