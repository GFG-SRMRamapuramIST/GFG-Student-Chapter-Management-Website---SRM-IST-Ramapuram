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
        return /^https?:\/\/.+/.test(v);
      },
      message: "Invalid URL format.",
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  meetingTime: {
    type: String,
    required: true,
  },
  compulsory: {
    type: String,
    enum: ["ALL", "MEMBER", "COREMEMBER"],
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  MoMLink: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: "Invalid URL format for MoM link.",
    },
    default: null,
  },
  MoMCreatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  MoMCreatedAt: {
    type: Date,
    default: null,
  },
});

const noticeGroupSchema = new mongoose.Schema({
  meetingDate: {
    type: Date,
    required: true,
    unique: true,
  },
  notices: [noticeSchema],
});

const Notice = mongoose.model("Notice", noticeGroupSchema);

module.exports = Notice;
