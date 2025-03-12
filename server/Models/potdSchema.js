const mongoose = require("mongoose");

const problemSchema = new mongoose.Schema({
  accuracy: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  problemName: {
    type: String,
    required: true,
    trim: true,
  },
  problemLink: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: "Invalid URL format.",
    },
  },
  topics: {
    type: [String],
    default: [],
  },
});

const problemCollectionSchema = new mongoose.Schema({
  leetcode: {
    type: problemSchema,
  },
  geeksforgeeks: {
    type: problemSchema,
  },
});

const potdSchema = mongoose.model("ProblemCollection", problemCollectionSchema);

module.exports = potdSchema;
