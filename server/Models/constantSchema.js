const mongoose = require("mongoose");

const constantSchema = new mongoose.Schema({
  achievementScheduler: {
    type: Boolean,
    default: true,
  },
  backupDataScheduler: {
    type: Boolean,
    default: true,
  },
  resetDataScheduler: {
    type: Boolean,
    default: true,
  },
});

const ConstantValue = mongoose.model("ConstantValue", constantSchema);

module.exports = ConstantValue;
