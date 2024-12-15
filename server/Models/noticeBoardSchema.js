const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  meetingLink: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v); // Validates URLs
      },
      message: "Invalid URL format.",
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  meetingDate: {
    type: Date,
    required: true,
  },
  meetingTime: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v); // Validates HH:MM (24-hour format)
      },
      message: "Invalid time format. Use HH:MM (24-hour).",
    },
  },
  compulsory: {
    type: Boolean,
    default: false, // If true, the meeting is mandatory to attend
  },
  description: {
    type: String,
    trim: true, // Additional information about the meeting
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically stores when the notice was created
  },
  notify: {
    type: Boolean,
    default: true, // Whether to send notifications for this notice
  },
});

const Notices = mongoose.model("notices", noticeSchema);

module.exports = Notices;
