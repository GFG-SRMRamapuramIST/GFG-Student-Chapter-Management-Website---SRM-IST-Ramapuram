const mongoose = require("mongoose");

const backUpSchema = new mongoose.Schema({
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
  codolioProfileLink: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v); // Validates URL format
      },
      message: "Invalid URL format",
    },
  },
  solvedQuestionsCount: {
    type: Number,
    default: 0,
    min: 0, // Ensures non-negative values
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "teams", // Reference to the `teams` schema
    default: null,
  },
  totalContestsParticipated: {
    type: Number,
    default: 0,
    min: 0, // Ensures non-negative values
  },
});

const BackUp = mongoose.model("BackUp", backUpSchema);

module.exports = BackUp;
