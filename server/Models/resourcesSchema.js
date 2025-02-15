const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"],
    required: true,
  },
  platform: {
    type: String,
    enum: ["LeetCode", "CodeChef", "Codeforces"],
    required: true,
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

const resourceSchema = new mongoose.Schema({
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
  platform: {
    type: [String], // Array of platform names
    default: [], // Initially empty
  },
  questions: {
    type: [questionSchema], // Array of questions
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Resources = mongoose.model("resources", resourceSchema);

module.exports = Resources;
