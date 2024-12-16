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
});

const AllowedEmail = mongoose.model("AllowedEmail", allowedEmailSchema);

module.exports = AllowedEmail;
