const express = require("express");
const multer = require("multer");
const path = require("path");

const router = new express.Router();

const { userControllers } = require("../Controllers");

/*
************************** APIs **************************
0. Get Edit Profile Page Data - "{BACKEND_URL}/api/v1/user/get-edit-profile-page-data"

1. Edit Profile API - "{BACKEND_URL}/api/v1/user/edit-profile"
2. Change Password API - "{BACKEND_URL}/api/v1/user/change-password"
3. Edit Profile Picture API - "{BACKEND_URL}/api/v1/user/edit-profile-picture"
4. Join a Team API - "{BACKEND_URL}/api/v1/user/join-team"
5. Leave a Team API - "{BACKEND_URL}/api/v1/user/leave-team"

**********************************************************
*/

// Multer configuration for handling profile picture upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/ProfilePicUploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB
});

// Middleware to handle profile picture upload
const uploadProfilePicture = upload.single("profilePicture");

//0. Get edit profile page data API
router.get("/get-edit-profile-page-data", userControllers.getEditProfilePageData)

//1. Edit Profile API
router.post("/edit-profile", userControllers.editProfile);

//2. Change Password API
router.post("/change-password", userControllers.changePassword);

//3. Edit Profile Picture API
router.post("/edit-profile-picture", uploadProfilePicture, userControllers.editProfilePicture);

//4. Join a Team API
router.post("/join-team", userControllers.joinTeam);

//5. Leave a Team API
router.post("/leave-team", userControllers.leaveTeam);

module.exports = router;
