const mongoose = require("mongoose");

const constantSchema = new mongoose.Schema({
  teamSize: {
    type: Number,
    default: 5, // Default value set to 5
  },
  totalContests: {
    type: Number,
    default: 0,
    min: 0, // Ensures non-negative values
  },
});

const ConstantValue = mongoose.model("ConstantValue", constantSchema);

module.exports = ConstantValue;
