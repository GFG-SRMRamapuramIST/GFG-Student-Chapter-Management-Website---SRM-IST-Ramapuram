const mongoose = require("mongoose");

const userPerformanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the user schema
    required: true,
  },
  solvedQuestionsCount: {
    type: Number,
    default: 0, // Number of questions solved by the user in this contest
  },
  attended: {
    type: Boolean,
    default: false, // Whether the user attended the contest
  },
});

const contestSchema = new mongoose.Schema({
  contestName: {
    type: String,
    required: true, // Name of the contest
  },
  startTime: {
    type: Date,
    required: true, // Starting time of the contest
  },
  endTime: {
    type: Date,
    required: true, // Ending time of the contest
  },
  participants: [userPerformanceSchema], // List of users and their performance
});

const dailyContestsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true, // One document per date
  },
  contests: [contestSchema], // List of contests for the given date
});

// Create and export the model
const DailyContests = mongoose.model("dailyContests", dailyContestsSchema);

module.exports = DailyContests;
