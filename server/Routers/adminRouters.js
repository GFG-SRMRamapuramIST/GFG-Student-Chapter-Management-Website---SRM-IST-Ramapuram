const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");

const { adminControllers } = require("../Controllers");

const router = new express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, "Public")));

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

module.exports = router;
