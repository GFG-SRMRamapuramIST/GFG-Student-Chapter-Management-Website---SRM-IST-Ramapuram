const mongoose = require('mongoose');

// Define the Festival schema
const festivalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, // Removes extra spaces
  },
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the Festival model
const Festival = mongoose.model('Festival', festivalSchema);

module.exports = Festival;
