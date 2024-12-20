const mongoose = require("mongoose");

const constantSchema = new mongoose.Schema({
  teamSize: {
    type: Number,
    default: 5, // Default value set to 5
  },
});

const ConstantValue = mongoose.model("ConstantValue", constantSchema);

module.exports = ConstantValue;
