const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
  contestName: {
    type: String,
    required: true,
  },
  contestLink: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
    enum: ["CodeChef", "Codeforces", "LeetCode"],
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

const dailyContestsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  contests: [contestSchema], // Only storing contest details, no participants
});

const DailyContests = mongoose.model("dailyContests", dailyContestsSchema);

module.exports = DailyContests;
