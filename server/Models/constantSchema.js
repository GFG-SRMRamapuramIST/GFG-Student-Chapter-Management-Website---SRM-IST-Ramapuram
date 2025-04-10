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
  autoKickScheduler: {
    type: Boolean,
    default: false,
  },
  passingMarks: {
    type: Number,
    required: true,
    default: 30,
  },
});

const ConstantValue = mongoose.model("ConstantValue", constantSchema);

module.exports = ConstantValue;
