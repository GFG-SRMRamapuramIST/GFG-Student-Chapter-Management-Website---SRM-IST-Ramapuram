const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "Invalid URL format.",
    },
  },
});

const videoResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  videos: {
    type: [videoSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const VideoResources = mongoose.model("video_resources", videoResourceSchema);

module.exports = VideoResources;
