const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const { adminControllers } = require("../Controllers");

const router = new express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, "Public")));

/*
************************** APIs **************************

1. Add Emails using CSV file to register API - "{BACKEND_URL}/api/v1/admin/upload-csv-allowed-emails"
2. Add array of Emails to register API - "{BACKEND_URL}/api/v1/admin/add-allowed-emails"
3. Fetch all allowed emails API - "{BACKEND_URL}/api/v1/admin/fetch-all-allowed-emails"
4. Delete emails from AllowedEmail schema API - "{BACKEND_URL}/api/v1/admin/delete-allowed-emails"
5. Block email/user from website API - "{BACKEND_URL}/api/v1/admin/block-email"
6. Unblock email/user from website API - "{BACKEND_URL}/api/v1/admin/unblock-email"
7. Delete Users from website API
8. Promote user one rank above API
9. Demote user one rank below API

**********************************************************
*/

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/CSVUploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

// Add Emails using CSV file to register API
router.post(
  "/upload-csv-allowed-emails",
  upload.single("file"),
  adminControllers.uploadCSVAllowedEmails
);

// Add array of Emails to register API
router.post("/add-allowed-emails", adminControllers.addAllowedEmails);

// Fetch all allowed emails
router.post("/fetch-all-allowed-emails", adminControllers.fetchAllowedEmails);

// Delete emails from AllowedEmail schema
router.delete("/delete-allowed-emails", adminControllers.deleteAllowedEmails);

// Block email/user from website API
router.post("/block-email", adminControllers.blockEmail);

// Unblock email/user from website API
router.post("/unblock-email", adminControllers.unblockEmail);

module.exports = router;
