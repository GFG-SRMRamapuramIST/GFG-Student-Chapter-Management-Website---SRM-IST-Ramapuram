const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v); // Validates URLs
      },
      message: "Invalid URL format.",
    },
  },
  sharedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users", // Reference to the `users` schema
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  notify: {
    type: Boolean,
    default: false, // Set to true if users need to be notified
  },
});

const Resources = mongoose.model("resources", resourceSchema);

module.exports = Resources;
