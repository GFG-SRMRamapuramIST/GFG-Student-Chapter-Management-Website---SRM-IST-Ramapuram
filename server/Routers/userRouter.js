const express = require("express");
const multer = require("multer");

const router = new express.Router();

const { userControllers } = require("../Controllers");

/*
************************** APIs **************************
0. Get Edit Profile Page Data - "{BACKEND_URL}/api/v1/user/get-edit-profile-page-data"

1. Edit Profile API - "{BACKEND_URL}/api/v1/user/edit-profile"
2. Change Password API - "{BACKEND_URL}/api/v1/user/change-password"
3. Edit Profile Picture API - "{BACKEND_URL}/api/v1/user/edit-profile-picture"
4. Toggle Subscibe API - "{BACKEND_URL}/api/v1/user/toggle-subscribe-btn"

5. Get Profile Page Data API - "{BACKEND_URL}/api/v1/user/get-profile-data"
6. Get Leaderboard Data API - "{BACKEND_URL}/api/v1/user/get-leaderboard-data"
7. Get top 5 users API - "{BACKEND_URL}/api/v1/user/get-top-5-users"
8. Get POTD API - "{BACKEND_URL}/api/v1/user/get-potd"

9. Report an Issue API - "{BACKEND_URL}/api/v1/user/report-an-issue"

10. Get all users with their id and name - "{BACKEND_URL}/api/v1/user/get-all-users-with-id-and-name"

11. Generating Verification code for Platform API - "{BACKEND_URL}/api/v1/user/generate-verification-code"
12. Verifying platfrom API - "{BACKEND_URL}/api/v1/user/verify-platform"

 Join a Team API - "{BACKEND_URL}/api/v1/user/join-team"
 Leave a Team API - "{BACKEND_URL}/api/v1/user/leave-team"

**********************************************************
*/

// Multer configuration for handling profile picture upload
const storage = multer.memoryStorage();

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
const uploadIssueScreenShot = upload.single("issueScreenShot");

//0. Get edit profile page data API
router.get(
  "/get-edit-profile-page-data",
  userControllers.getEditProfilePageData
);

//1. Edit Profile API
router.post("/edit-profile", userControllers.editProfile);

//2. Change Password API
router.post("/change-password", userControllers.changePassword);

//3. Edit Profile Picture API
router.post(
  "/edit-profile-picture",
  uploadProfilePicture,
  userControllers.editProfilePicture
);

//4. Toggle Subscribe API
router.post("/toggle-subscribe-btn", userControllers.toggleSubscribeOption);

//5. Get Profile Page Data API
router.post("/get-profile-data", userControllers.getProfilePageData);

//6. Get Leaderboard Data API
router.post("/get-leaderboard-data", userControllers.fetchLeaderBoardData);

//7. Get top 5 users API
router.get("/get-top-5-users", userControllers.fetchTopPerformers);

//8. Get POTD API
router.get("/get-potd", userControllers.fetchPOTD);

//9. Report an Issue API
router.post(
  "/report-an-issue",
  uploadIssueScreenShot,
  userControllers.reportAnIssue
);

//10. Get all users with their id and name
router.get(
  "/get-all-users-with-id-and-name",
  userControllers.getAllUsersForComparison
);

//11. Generating Verification code for Platform API
router.post(
  "/generate-verification-code",
  userControllers.verificationCodeForPlatform
)

//12. Verifying platfrom API
router.post(
  "/verify-platform",
  userControllers.verifyPlatform
)

/*
//4. Join a Team API
router.post("/join-team", userControllers.joinTeam);

//5. Leave a Team API
router.post("/leave-team", userControllers.leaveTeam);
*/

module.exports = router;
