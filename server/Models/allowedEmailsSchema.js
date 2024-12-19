const mongoose = require("mongoose");

const allowedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  OTP: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 8,
  },
});

const AllowedEmail = mongoose.model("AllowedEmail", allowedEmailSchema);

module.exports = AllowedEmail;
