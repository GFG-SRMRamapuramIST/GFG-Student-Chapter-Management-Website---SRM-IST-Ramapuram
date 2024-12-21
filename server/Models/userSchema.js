require("dotenv").config();

const chalk = require("chalk");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Team } = require(".");

const SECRET_KEY = process.env.SECRET_KEY;

const userSchema = new mongoose.Schema({
  profilePicture: {
    type: String,
    default:
      "https://res.cloudinary.com/dcmqniwwc/image/upload/v1703640166/yc3f9btxcrjlccq3b7dg.png",
  },
  name: {
    type: String,
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
    enum: ["USER", "MEMBER", "COREMEMBER", "ADMIN"],
    default: "USER",
  },
  linkedinProfileLink: {
    type: String,
    default: null,
  },
  codolioProfileLink: {
    type: String,
    default: null,
  },
  leetcodeProfileLink: {
    type: String,
    default: null,
  },
  codechefProfileLink: {
    type: String,
    default: null,
  },
  codeforcesProfileLink: {
    type: String,
    default: null,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teams", // Reference to the `teams` schema
    default: null,
  },
  solvedQuestionsCount: {
    type: Number,
    default: 0,
    min: 0, // Ensures non-negative values
  },
  totalContestsParticipated: {
    type: Number,
    default: 0,
    min: 0, // Ensures non-negative values
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
  authToken: {
    type: String,
    default: null,
  },
});

// Hash password when password is changed/modified
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Trigger team update whenever solvedQuestionsCount changes/modified
userSchema.post("save", async function () {
  if (this.isModified("solvedQuestionsCount") && this.teamId) {
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

    this.authToken = newToken;
    await this.save();
    return newToken;
  } catch (error) {
    console.error(
      chalk.bgRed.bold.red("Error generating auth token:"),
      error.message
    );
    return null;
  }
};

// Create & Export user model
const Users = mongoose.model("users", userSchema);

module.exports = Users;
