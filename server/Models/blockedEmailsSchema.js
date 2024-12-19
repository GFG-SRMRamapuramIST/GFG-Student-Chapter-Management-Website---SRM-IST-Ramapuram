const mongoose = require("mongoose");

const blockedEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  blockedAt: {
    type: Date,
    default: Date.now,
  },
});

const BlockedEmails = mongoose.model("BlockedEmail", blockedEmailSchema);

module.exports = BlockedEmails;
