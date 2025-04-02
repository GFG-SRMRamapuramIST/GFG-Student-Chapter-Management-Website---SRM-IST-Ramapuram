require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Team } = require(".");

const SECRET_KEY = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    default: null,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  academicYear: {
    type: Number,
    enum: [1, 2, 3, 4],
  },
  phoneNumber: {
    type: Number,
    default: null,
  },
  role: {
    type: String,
    enum: [
      "USER",
      "MEMBER",
      "COREMEMBER",
      "VICEPRESIDENT",
      "PRESIDENT",
      "ADMIN",
    ],
    default: "USER",
  },
  linkedinUsername: {
    type: String,
    default: null,
  },
  leetcodeUsername: {
    type: String,
    default: null,
  },
  codechefUsername: {
    type: String,
    default: null,
  },
  codeforcesUsername: {
    type: String,
    default: null,
  },
  geeksforgeeksUsername: {
    type: String,
    default: null,
  },
  totalQuestionSolved: {
    type: Number,
    default: 0,
    min: 0,
  },
  currentRank: {
    type: Number,
    default: null,
  },
  prevMonthData: {
    totalQuestionsSolved: { type: Number, default: 0 },
    prevRank: { type: Number, default: null },
  },
  achievement: {
    gold: [{ month: Number, year: Number }],
    silver: [{ month: Number, year: Number }],
    bronze: [{ month: Number, year: Number }],
    maxAvgPerDay: [{ month: Number, year: Number }],
    dailyActiveStreak: [{ month: Number, year: Number }],
  },
  platforms: {
    codechef: {
      rating: { type: Number, default: 0 },
      countryRank: { type: Number, default: 0 },
      highestRating: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
      firstName: { type: String, default: null },
    },
    leetcode: {
      badgesCount: { type: Number, default: 0 },
      ranking: { type: Number, default: 0 },
      totalProblemSolved: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
      firstName: { type: String, default: null },
    },
    codeforces: {
      rating: { type: Number, default: 0 },
      rank: { type: String, default: "unrated" },
      totalProblemSolved: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
      firstName: { type: String, default: null },
    },
    geeksforgeeks: {
      universityRank: { type: Number, default: 0 },
      codingScore: { type: Number, default: 0 },
      problemSolved: { type: Number, default: 0 },
      verified: { type: Boolean, default: false },
      firstName: { type: String, default: null },
    },
  },
  dailyActivity: [
    {
      date: { type: Date, required: true },
      count: { type: Number, default: 0 },
    },
  ],
  avgPerDay: {
    type: Number,
    default: 0,
  },
  maxStreak: {
    type: Number,
    default: 0,
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
  authToken: {
    type: String,
    default: null,
  },
  resetPasswordOTP: {
    type: Number,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
});

// Hash password when password is changed/modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Trigger team update whenever totalQuestionSolved changes/modified
userSchema.post("save", async function () {
  if (this.isModified("totalQuestionSolved") && this.teamId) {
    const team = await Team.findById(this.teamId);
    if (team) {
      await team.updateTeamSolvedQuestions();
    }
  }
});

// Token generate
userSchema.methods.generateAuthtoken = async function () {
  try {
    let newToken = jwt.sign({ _id: this._id }, SECRET_KEY, {
      expiresIn: "1h", // 1h sets the expiration to 1 hour (30m for 30 minutes)
    });

    await this.updateOne({ authToken: newToken });
    return newToken;
  } catch (error) {
    console.error("Error generating auth token:", error.message);
    return null;
  }
};

// Create & Export user model
const Users = mongoose.model("users", userSchema);

module.exports = Users;
